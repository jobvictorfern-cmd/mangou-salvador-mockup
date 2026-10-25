import * as THREE from './assets/vendor/three.module.min.js';

// Alternativa sem GPU: projeta a mesma cena e as mesmas instâncias 3D no Canvas.
// Mantém a montagem em aparelhos sem WebGL, sem carregar um vídeo substituto.
export class SoftwareCupRenderer {
  constructor(canvas) {
    this.canvas=canvas; this.ctx=canvas.getContext('2d');
    if(!this.ctx)throw new Error('Canvas indisponível');
    this.ratio=1;this.width=1;this.height=1;
    this.capabilities={getMaxAnisotropy:()=>1};
    this.point=new THREE.Vector3();this.matrix=new THREE.Matrix4();this.instance=new THREE.Matrix4();
  }
  setPixelRatio(value){this.ratio=Math.min(value,1.5);}
  setSize(width,height){this.width=width;this.height=height;this.canvas.width=Math.round(width*this.ratio);this.canvas.height=Math.round(height*this.ratio);}
  project(x,y,z,matrix) {
    this.point.set(x,y,z);if(matrix)this.point.applyMatrix4(matrix);
    this.point.applyMatrix4(this.view);const depth=this.point.z;
    this.point.applyMatrix4(this.projection);
    return {x:(this.point.x*.5+.5)*this.width,y:(-.5*this.point.y+.5)*this.height,depth};
  }
  line(points,stroke,width=1,close=false,fill=null) {
    const c=this.ctx;if(!points.length)return;
    c.beginPath();c.moveTo(points[0].x,points[0].y);points.slice(1).forEach(p=>c.lineTo(p.x,p.y));if(close)c.closePath();
    if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=width;c.stroke();}
  }
  circle(radius,y,matrix,front=null) {
    const points=[];
    const start=front===true?-Math.PI/2:front===false?Math.PI/2:0;
    const total=front===null?Math.PI*2:Math.PI;
    for(let i=0;i<=64;i++){const a=start+i/64*total;points.push(this.project(Math.sin(a)*radius,y,Math.cos(a)*radius,matrix));}
    return points;
  }
  textureTriangle(image,pts,uv) {
    const c=this.ctx,[p0,p1,p2]=pts,[s0,s1,s2]=uv.map(p=>({x:p.x*image.width,y:p.y*image.height}));
    const den=s0.x*(s1.y-s2.y)+s1.x*(s2.y-s0.y)+s2.x*(s0.y-s1.y);if(Math.abs(den)<.001)return;
    const a=(p0.x*(s1.y-s2.y)+p1.x*(s2.y-s0.y)+p2.x*(s0.y-s1.y))/den;
    const b=(p0.y*(s1.y-s2.y)+p1.y*(s2.y-s0.y)+p2.y*(s0.y-s1.y))/den;
    const d=(p0.x*(s2.x-s1.x)+p1.x*(s0.x-s2.x)+p2.x*(s1.x-s0.x))/den;
    const e=(p0.y*(s2.x-s1.x)+p1.y*(s0.x-s2.x)+p2.y*(s1.x-s0.x))/den;
    const tx=(p0.x*(s1.x*s2.y-s2.x*s1.y)+p1.x*(s2.x*s0.y-s0.x*s2.y)+p2.x*(s0.x*s1.y-s1.x*s0.y))/den;
    const ty=(p0.y*(s1.x*s2.y-s2.x*s1.y)+p1.y*(s2.x*s0.y-s0.x*s2.y)+p2.y*(s0.x*s1.y-s1.x*s0.y))/den;
    c.save();const centroid={x:(p0.x+p1.x+p2.x)/3,y:(p0.y+p1.y+p2.y)/3};const clip=pts.map(p=>{const dx=p.x-centroid.x,dy=p.y-centroid.y,d=Math.hypot(dx,dy)||1;return{x:p.x+dx/d*.55,y:p.y+dy/d*.55};});this.line(clip,null,0,true);c.clip();c.transform(a,b,d,e,tx,ty);c.drawImage(image,0,0);c.restore();
  }
  surfaceImage(image, matrix, halfWidth, bottom, top, z=0) {
    const a=this.project(-halfWidth,top,z,matrix),b=this.project(halfWidth,top,z,matrix),d=this.project(-halfWidth,bottom,z,matrix);
    const c=this.ctx;c.save();c.transform((b.x-a.x)/image.width,(b.y-a.y)/image.width,(d.x-a.x)/image.height,(d.y-a.y)/image.height,a.x,a.y);c.drawImage(image,0,0);c.restore();
  }
  render(scene,camera) {
    scene.updateMatrixWorld(true);camera.updateMatrixWorld(true);
    this.view=camera.matrixWorldInverse;this.projection=camera.projectionMatrix;
    const c=this.ctx,w=this.width,h=this.height;c.setTransform(this.ratio,0,0,this.ratio,0,0);c.clearRect(0,0,w,h);c.lineCap='round';c.lineJoin='round';
    const cup=scene.getObjectByName('cup'),m=cup.matrixWorld,textures=scene.userData.productTextures;
    const bottom=this.project(0,.04,0,m),edge=this.project(.8,.04,0,m),unit=Math.abs(edge.x-bottom.x)/.8;
    const shadow=c.createRadialGradient(bottom.x,bottom.y,2,bottom.x,bottom.y,unit*1.65);
    shadow.addColorStop(0,'rgba(35,51,22,.28)');shadow.addColorStop(.5,'rgba(35,51,22,.10)');shadow.addColorStop(1,'rgba(35,51,22,0)');
    c.save();c.translate(bottom.x,bottom.y+unit*.02);c.scale(1,.28);c.fillStyle=shadow;
    // O gradiente acompanha o ponto de contato com o chão.
    c.translate(-bottom.x,-bottom.y);c.fillRect(bottom.x-unit*2,bottom.y-unit*2,unit*4,unit*4);c.restore();
    const topBack=this.circle(.95,2.79,m,false),baseFront=this.circle(.69,.105,m,true);
    const leftTop=this.project(-.95,2.79,0,m),rightTop=this.project(.95,2.79,0,m);
    const silhouette=[...topBack,...baseFront];
    const glass=c.createLinearGradient(leftTop.x,0,rightTop.x,0);
    glass.addColorStop(0,'rgba(255,255,255,.13)');glass.addColorStop(.15,'rgba(240,255,235,.015)');glass.addColorStop(.78,'rgba(255,255,255,0)');glass.addColorStop(1,'rgba(255,255,255,.17)');
    this.line(silhouette,'rgba(255,255,255,.24)',1,true,glass);
    this.line(this.circle(.94,2.77,m), 'rgba(255,255,255,.4)',unit*.015);
    this.line(this.circle(.916,2.74,m), 'rgba(104,125,85,.27)',unit*.012);

    const pile=scene.getObjectByName('fruit-pile');
    if(pile?.visible&&textures?.pileTexture) {
      const top=.20+2.45*pile.userData.fill,topRadius=.59+.21*pile.userData.fill;
      const clip=[this.project(-topRadius,top,0,m),this.project(topRadius,top,0,m),this.project(.59,.20,0,m),this.project(-.59,.20,0,m)];
      c.save();this.line(clip,null,0,true);c.clip();this.surfaceImage(textures.pileTexture.image,m,.81,.20,2.65,.08);c.restore();
    }

    const mango=scene.getObjectByName('mango'),sorted=[];
    const color=new THREE.Color();
    for(let i=0;i<mango.count;i++) {
      mango.getMatrixAt(i,this.instance);this.matrix.multiplyMatrices(mango.matrixWorld,this.instance);
      const center=this.project(0,0,0,this.matrix);if(center.y<-unit||center.y>h+unit)continue;
      // O volume texturizado absorve as tiras que já assentaram, sem dupla camada.
      if(pile?.visible){const cupPoint=new THREE.Vector3(0,0,0).applyMatrix4(this.instance);if(cupPoint.y<.2+2.45*pile.userData.fill-.08)continue;}
      const points=[];
      for(let k=0;k<=9;k++) {const t=k/9;points.push(this.project((Math.sin(t*Math.PI*2)*.022+.005)*2.2,t-.5,Math.sin(t*Math.PI)*.018,this.matrix));}
      const a=this.project(-.061,0,0,this.matrix),b=this.project(.061,0,0,this.matrix),high=this.project(0,.5,0,this.matrix),low=this.project(0,-.5,0,this.matrix);
      mango.getColorAt(i,color);sorted.push({points,depth:center.depth,width:Math.max(1,Math.hypot(b.x-a.x,b.y-a.y)),color:color.clone(),index:i,a,b,high,low,center});
    }
    sorted.sort((a,b)=>a.depth-b.depth);
    sorted.forEach(p=>{
      if(textures?.fruitSprites) {
        const sprite=textures.fruitSprites[p.index%textures.fruitSprites.length],ax=p.b.x-p.a.x,ay=p.b.y-p.a.y,bx=p.low.x-p.high.x,by=p.low.y-p.high.y;
        const centerX=(p.high.x+p.low.x)/2,centerY=(p.high.y+p.low.y)/2;
        c.save();c.transform(ax/sprite.width,ay/sprite.width,bx/sprite.height,by/sprite.height,centerX-(ax+bx)/2,centerY-(ay+by)/2);c.drawImage(sprite,0,0);c.restore();return;
      }
      this.line(p.points,'rgba(123,107,35,.17)',p.width+1);
      p.color.multiplyScalar(.86+(p.index%9)/40);
      this.line(p.points,`#${p.color.getHexString()}`,p.width);
      const highlight=p.points.map(point=>({x:point.x-p.width*.15,y:point.y}));
      this.line(highlight,'rgba(255,251,191,.32)',Math.max(.5,p.width*.20));
    });

    const lime=scene.getObjectByName('lime');
    if(lime.visible) {
      if(textures?.limeSprite) {
        const image=textures.limeSprite,a=this.project(-.38,.04,-.34,lime.matrixWorld),b=this.project(.38,.04,-.34,lime.matrixWorld),d=this.project(-.38,.04,.34,lime.matrixWorld);
        c.save();c.transform((b.x-a.x)/image.width,(b.y-a.y)/image.width,(d.x-a.x)/image.height,(d.y-a.y)/image.height,a.x,a.y);c.drawImage(image,0,0);c.restore();
      } else {
      const image=lime.material[1].map.image,center=this.project(0,.039,0,lime.matrixWorld),rim=[];
      for(let i=0;i<=48;i++) {const a=i/48*Math.PI*2;rim.push(this.project(Math.cos(a)*.34,.039,Math.sin(a)*.34,lime.matrixWorld));}
      this.line(rim,'#648b22',unit*.05,true,'#e2e99a');
      for(let i=0;i<48;i++) {const a=i/48*Math.PI*2,b=(i+1)/48*Math.PI*2;
        this.textureTriangle(image,[center,rim[i],rim[i+1]],[{x:.5,y:.5},{x:.5+Math.cos(a)*.5,y:.5+Math.sin(a)*.5},{x:.5+Math.cos(b)*.5,y:.5+Math.sin(b)*.5}]);
      }
      }
    }
    const salt=scene.getObjectByName('salt');
    if(salt.visible) {const positions=salt.geometry.attributes.position;c.fillStyle='#fffce7';for(let i=0;i<positions.count;i++){const p=this.project(positions.getX(i),positions.getY(i),positions.getZ(i),salt.matrixWorld);c.beginPath();c.arc(p.x,p.y,Math.max(.7,unit*.008),0,Math.PI*2);c.fill();}}

    // Reflexos da parede frontal deixam a fruta visível através do PET.
    const topFront=this.circle(.95,2.79,m,true),base=this.circle(.69,.105,m,true);
    this.line([topFront[0],...base,...topFront.slice().reverse()],null,0,true,glass);
    this.line([leftTop,this.project(-.69,.105,0,m)],'rgba(255,255,255,.40)',unit*.009);
    this.line([rightTop,this.project(.69,.105,0,m)],'rgba(255,255,255,.32)',unit*.008);
    if(textures?.petReflection)this.surfaceImage(textures.petReflection,m,1,.02,2.93,.02);
    [.12,.22,.29,.36].forEach(y=>this.line(this.circle(.69+y/2.8*.27,y,m,true),'rgba(255,255,255,.22)',unit*.008));
    const dew=scene.getObjectByName('dew');
    if(dew){for(let i=0;i<dew.count;i++){dew.getMatrixAt(i,this.instance);this.matrix.multiplyMatrices(dew.matrixWorld,this.instance);const center=this.project(0,0,0,this.matrix),right=this.project(1,0,0,this.matrix);const r=Math.max(.45,Math.hypot(right.x-center.x,right.y-center.y));c.beginPath();c.arc(center.x,center.y,r,.15,Math.PI*1.15);c.strokeStyle='rgba(16,42,21,.28)';c.lineWidth=.7;c.stroke();c.beginPath();c.arc(center.x-r*.16,center.y-r*.22,r*.45,Math.PI,Math.PI*1.7);c.strokeStyle='rgba(255,255,255,.62)';c.lineWidth=.6;c.stroke();}}
    const label=scene.getObjectByName('label'),image=label.material.map.image;
    const labelCenter=this.project(0,1.395,.84,m),labelLeft=this.project(-.63,1.395,.61,m),labelRight=this.project(.63,1.395,.61,m),labelTop=this.project(0,2.07,.90,m),labelBottom=this.project(0,.72,.77,m);
    const ax=labelRight.x-labelLeft.x,ay=labelRight.y-labelLeft.y,bx=labelBottom.x-labelTop.x,by=labelBottom.y-labelTop.y;
    c.save();c.transform(ax/image.width,ay/image.width,bx/image.height,by/image.height,labelCenter.x-(ax+bx)/2,labelCenter.y-(ay+by)/2);c.drawImage(image,0,0);c.restore();
    const lid=scene.getObjectByName('lid');
    if(lid.visible) {
      if(textures?.lidReflection) {
        this.surfaceImage(textures.lidReflection,lid.matrixWorld,1.01,-.06,.81,.03);
        this.line(this.circle(.964,0,lid.matrixWorld),'rgba(255,255,255,.45)',unit*.016);
      } else {
      const curve=[];
      for(let i=0;i<=48;i++){const a=i/48*Math.PI;curve.push(this.project(-Math.cos(a)*.94,Math.sin(a)*.62,0,lid.matrixWorld));}
      this.line([...curve,...this.circle(.94,0,lid.matrixWorld,true).reverse()],'rgba(255,255,255,.7)',unit*.017,true,'rgba(250,255,245,.13)');
      this.line(this.circle(.964,0,lid.matrixWorld),'rgba(255,255,255,.80)',unit*.035);
      this.line(this.circle(.95,.055,lid.matrixWorld),'rgba(255,255,255,.6)',unit*.013);
      for(let i=0;i<28;i++){const a=-Math.PI/2+i/27*Math.PI;this.line([this.project(Math.sin(a)*.97,-.025,Math.cos(a)*.97,lid.matrixWorld),this.project(Math.sin(a)*.97,.03,Math.cos(a)*.97,lid.matrixWorld)],'rgba(255,255,255,.68)',unit*.012);}
      const shine=[];
      for(let i=0;i<=24;i++){const a=.12+i/24*1.18;shine.push(this.project(-.58*Math.cos(a),.62*Math.sin(a),.58*Math.cos(a),lid.matrixWorld));}
      this.line(shine,'rgba(255,255,255,.62)',unit*.04);
      }
    }
  }
}
