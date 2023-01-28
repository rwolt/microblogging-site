export const resizeImage = (image, width) => {
  return new Promise((resolve, reject) => {
    console.log("resize image");
    let canvas = document.createElement("canvas");
    let canvasContext = canvas.getContext("2d");

    let reader = new FileReader();

    reader.readAsDataURL(image);

    reader.onload = () => {
      let dummyImg = new Image(0, 0);

      dummyImg.src = reader.result;

      dummyImg.onload = () => {
        const origWidth = dummyImg.naturalWidth;
        const origHeight = dummyImg.naturalHeight;

        const desiredWidth = width;

        const ratio = desiredWidth / origWidth;

        const correspondingHeight = ratio * origHeight;

        canvas.width = desiredWidth;
        canvas.height = correspondingHeight;

        canvasContext.drawImage(
          dummyImg,
          0,
          0,
          desiredWidth,
          correspondingHeight
        );

        const resizedImage = canvas.toDataURL(image.type, 0.98);

        resolve(resizedImage);
      };
    };
  });
};
