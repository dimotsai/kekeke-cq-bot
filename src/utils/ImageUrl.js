class ImageUrl {
  static getRegex() {
    const imageRegex = /(https?:\/\/)(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&\\/=]*)\.(?:png|jpe?g|gif|gifv|mp4)(\?(?:&?[^\s=&]*(=[^\s=&]*)?)*)?/ig;
    return imageRegex;
  }

  static parse(text) {
    return text.match(ImageUrl.getRegex());
  }
}

module.exports = ImageUrl;
