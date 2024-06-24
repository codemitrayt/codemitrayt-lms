import siteConfig from "@/configs/site-config"
import Image from "next/image"

const Logo = () => {
  return (
    <div className="flex items-center space-x-2">
      <div className="size-[30px] border rounded-full overflow-hidden flex items-center justify-center">
        <Image
          src="/codemitrayt.svg"
          alt="codemitrayt"
          height={40}
          width={40}
        />
      </div>
      <span className="text-sm sm:text-lg font-bold">{siteConfig.name}</span>
    </div>
  )
}

export default Logo
