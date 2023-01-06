import withMDX from "@next/mdx"

const useMdx = withMDX({
  extension: /\.mdx$/,
  options: {},
})


export default useMdx({
  reactStrictMode: true,
  pageExtensions: ["jsx", "mdx"],
  
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.jsx$/,
      use: [{ loader: "@svgr/webpack", options: { svgo: false } }],
    })
  
    return config
  },
})