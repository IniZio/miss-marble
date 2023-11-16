import { Separator } from '@/components/ui/separator'
import { type PropsWithChildren } from 'react'

const ModuleHeader: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <div>
      <div className="flex items-center justify-between">
        {children}
      </div>
    </div>
  )
}

const ModuleHeaderTitle: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <h2 className="text-lg font-semibold">{children}</h2>
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