import Document, { Html, Head, NextScript, Main } from "next/document";

export default class _Document extends Document {
  render() {
    const { colorScheme } = this.props.__NEXT_DATA__.props;

    return (
      <Html lang="en" className={colorScheme}>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
