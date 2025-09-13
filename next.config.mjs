/** @type {import('next').NextConfig} */
const nextConfig = {
  // This is a direct command to the Next.js compiler.
  // We are telling it: "The 'react-map-gl' and 'mapbox-gl' libraries are not to be trusted.
  // You will take them, you will process them, you will force them to comply with our architecture."
  // This eradicates any module format issues at the root.
  transpilePackages: ["react-map-gl", "mapbox-gl"],
}

export default nextConfig