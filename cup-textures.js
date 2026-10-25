import * as THREE from './assets/vendor/three.module.min.js';

const canvas = (w,h) => {const c=document.createElement('canvas');c.width=w;c.height=h;return c;};
const load = name => new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=reject;image.src=new URL('./assets/'+name,import.meta.url).href;});

// Reaproveita os recortes macro existentes; não precisa de serviços externos.
export async function createProductTextures() {
  const [strips,atlas]=await Promise.all([load('mango-strips-real.webp'),load('cup-assembly-atlas.webp')]);
  const source=canvas(strips.width,strips.height),sourceCtx=source.getContext('2d');sourceCtx.drawImage(strips,0,0);
  const pixels=sourceCtx.getImageData(0,0,source.width,source.height).data;
  const flesh=canvas(128,512),f=flesh.getContext('2d');f.fillStyle='#ead47c';f.fillRect(0,0,128,512);
  for(let row=0;row<512;row++) {
    const y=Math.round(48+row/511*(strips.height-110));let bestStart=0,bestEnd=0,start=-1;
    for(let x=Math.floor(strips.width/3);x<Math.floor(strips.width*2/3);x++) {
      const p=(y*source.width+x)*4,solid=pixels[p+3]>220&&pixels[p]>165&&pixels[p+1]>130;
      if(solid&&start<0)start=x;
      if((!solid||x===Math.floor(strips.width*2/3)-1)&&start>=0){if(x-start>bestEnd-bestStart){bestStart=start;bestEnd=x;}start=-1;}
    }
    if(bestEnd-bestStart>5) {
      const margin=(bestEnd-bestStart)*.05;
      f.drawImage(strips,bestStart+margin,y,bestEnd-bestStart-margin*2,1,0,row,128,1);
    }
  }
  const fleshTexture=new THREE.CanvasTexture(flesh);fleshTexture.colorSpace=THREE.SRGBColorSpace;
  const bump=canvas(128,512),b=bump.getContext('2d');b.drawImage(flesh,0,0);
  const data=b.getImageData(0,0,128,512);
  for(let i=0;i<data.data.length;i+=4){const grey=Math.round(data.data[i]*.22+data.data[i+1]*.69+data.data[i+2]*.09);data.data[i]=data.data[i+1]=data.data[i+2]=grey;}
  b.putImageData(data,0,0);
  const bumpTexture=new THREE.CanvasTexture(bump);bumpTexture.colorSpace=THREE.NoColorSpace;

  const fruitSprites=[];
  for(let variant=0;variant<8;variant++) {
    const sprite=canvas(80,420),s=sprite.getContext('2d');
    const center=t=>40+Math.sin(t*Math.PI*1.3+variant*.7)*(3+variant%3);
    const half=t=>(24+variant%4*1.6)*(.34+.66*Math.sin(t*Math.PI)**.26);
    s.beginPath();
    for(let i=0;i<=32;i++){const t=i/32,x=center(t)-half(t),y=4+t*412;if(!i)s.moveTo(x,y);else s.lineTo(x,y);}
    for(let i=32;i>=0;i--){const t=i/32;s.lineTo(center(t)+half(t),4+t*412);}
    s.closePath();s.clip();s.drawImage(flesh,0,0,128,512,0,0,80,420);
    const shade=s.createLinearGradient(5,0,75,0);shade.addColorStop(0,'rgba(97,107,29,.30)');shade.addColorStop(.16,'rgba(151,144,59,.06)');shade.addColorStop(.48,'rgba(255,255,222,.11)');shade.addColorStop(.83,'rgba(255,255,224,.26)');shade.addColorStop(1,'rgba(107,111,34,.24)');s.fillStyle=shade;s.fillRect(0,0,80,420);
    fruitSprites.push(sprite);
  }
  function reflectionCrop(x,y,w,h) {
    const target=canvas(w,h),ctx=target.getContext('2d');ctx.drawImage(atlas,x,y,w,h,0,0,w,h);
    const data=ctx.getImageData(0,0,w,h);
    for(let p=0;p<data.data.length;p+=4) {
      const a=data.data[p+3]/255,luma=(data.data[p]+data.data[p+1]+data.data[p+2])/3;
      const highlight=Math.max(0,(luma-165)/90)*.42,shadow=Math.max(0,(105-luma)/105)*.16;
      data.data[p]=data.data[p+1]=data.data[p+2]=luma>165?246:34;
      data.data[p+3]=Math.round(Math.min(.52,highlight+shadow)*a*255);
    }
    ctx.putImageData(data,0,0);return target;
  }
  const petReflection=reflectionCrop(130,80,410,610);
  const lidReflection=reflectionCrop(65,800,540,290);
  const limeSprite=canvas(300,270);limeSprite.getContext('2d').drawImage(atlas,780,880,300,270,0,0,300,270);
  const pile=canvas(280,450);pile.getContext('2d').drawImage(atlas,790,170,280,450,0,0,280,450);
  const pileTexture=new THREE.CanvasTexture(pile);pileTexture.colorSpace=THREE.SRGBColorSpace;pileTexture.wrapS=THREE.RepeatWrapping;pileTexture.repeat.x=2;
  return {fleshTexture,bumpTexture,fruitSprites,petReflection,lidReflection,limeSprite,pileTexture};
}
