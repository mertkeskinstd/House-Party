import App from "./components/Main";

const colors = [
    [62, 35, 255],
    [60, 255, 60],
    [255, 35, 98],
    [45, 175, 230],
    [255, 0, 255],
    [255, 128, 0]
  ];
  
  let step = 0;
  const colorIndices = [0, 1, 2, 3];
  const gradientSpeed = 0.002;
  
  function updateGradient() {
    if (typeof $ === 'undefined') return; // jQuery'nin yüklü olup olmadığını kontrol et
  
    const [c0_0, c0_1, c1_0, c1_1] = colorIndices.map(index => colors[index]);
    const istep = 1 - step;
  
    const color1 = `rgb(${Math.round(istep * c0_0[0] + step * c0_1[0])}, 
                        ${Math.round(istep * c0_0[1] + step * c0_1[1])}, 
                        ${Math.round(istep * c0_0[2] + step * c0_1[2])})`;
  
    const color2 = `rgb(${Math.round(istep * c1_0[0] + step * c1_1[0])}, 
                        ${Math.round(istep * c1_0[1] + step * c1_1[1])}, 
                        ${Math.round(istep * c1_0[2] + step * c1_1[2])})`;
  
    $("#gradient").css({
      background: `linear-gradient(135deg, ${color1}, ${color2})`,
      background: `-webkit-linear-gradient(135deg, ${color1}, ${color2})`, // Safari 5.1 - 6.0
      background: `-moz-linear-gradient(135deg, ${color1}, ${color2})`, // FF3.6+
      background: `-o-linear-gradient(135deg, ${color1}, ${color2})`, // Opera 11.1+
      background: `-ms-linear-gradient(135deg, ${color1}, ${color2})`, // IE10+
      background: `linear-gradient(135deg, ${color1}, ${color2})` // W3C
    });
  
    step += gradientSpeed;
    if (step >= 1) {
      step %= 1;
      colorIndices[0] = colorIndices[1];
      colorIndices[2] = colorIndices[3];
  
      colorIndices[1] = (colorIndices[1] + Math.floor(1 + Math.random() * (colors.length - 1))) % colors.length;
      colorIndices[3] = (colorIndices[3] + Math.floor(1 + Math.random() * (colors.length - 1))) % colors.length;
    }
  }
  
  setInterval(updateGradient, 10);
  