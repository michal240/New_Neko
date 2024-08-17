import Vibrant from "node-vibrant";

function artSegregate() {}

function artColor(imageURL) {
  Vibrant.from(imageURL)
    .getPalette()
    .then((palette) => {
      console.log(palette);
      const dominantColor = palette.Vibrant.getHex();
      console.log("Dominujący kolor:", dominantColor);
      return dominantColor;
    })
    .catch((err) => {
      console.error(err);
    });
}

export { artSegregate, artColor };
