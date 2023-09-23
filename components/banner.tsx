import {CheckCircleIcon, AlertTriangle} from 'lucide-react'
import {cva, type VariantProps} from 'class-variance-authority'
import { cn } from '@/lib/utils'

const bannerVariantProps=cva('text-center p-4 border flex items-center gap-x-5',{
  variants:{
    variant:{
      warning:'bg-yellow-200/80 border-yellow-30 text-primary',
      success:'bg-emerald-200 border-emerald-700 text-secondary'
    }
  },
  defaultVariants:{
    variant:'warning'
  }
})

type BannerVariantProp=VariantProps<typeof bannerVariantProps>;

interface BannerProps extends BannerVariantProp {
  label:string;
}

const iconMap={
  success:CheckCircleIcon,
  warning:AlertTriangle
}

const Banner=({label, variant}:BannerProps)=>{
  const Icon=iconMap[variant || 'warning']
  return (
    <div className={cn(bannerVariantProps({variant}))}>
      <Icon className='w-4 h-4 mr-2'/>
      {label}
    </div>
  )
}

export default Banner;