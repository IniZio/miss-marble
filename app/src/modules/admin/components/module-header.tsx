import { Separator } from '@/components/ui/separator'
import { PropsWithChildren } from 'react'

const ModuleHeader: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between">
        {children}
      </div>
      <Separator className="my-6" />
    </div>
  )
}

const ModuleHeaderTitle: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <h2 className="text-lg font-medium">{children}</h2>
  )
}

const ModuleHeaderDescription: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <p className="text-sm text-muted-foreground">{children}</p>
  )
}

const ModuleHeaderActions: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <div className="flex items-center space-x-2">
      {children}
    </div>
  )
}

export { ModuleHeader, ModuleHeaderTitle, ModuleHeaderActions, ModuleHeaderDescription };