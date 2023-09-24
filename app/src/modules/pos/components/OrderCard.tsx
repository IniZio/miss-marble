/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  UploadIcon,
  FileIcon,
  EyeIcon,
  PencilIcon,
  ShareIcon,
  XIcon,
  Share2Icon,
} from "lucide-react"
import { format } from "date-fns"
// import isImage from "is-image"
import { ChangeEvent, useCallback, useMemo, useRef, useState } from "react"
import { getSupabase } from '@/clients/supabase'
import { isMobile } from '@/lib/isMobile'
import dayjs from 'dayjs'
import Spinner from '@/components/ui/spinner'
import { isImage } from '@/lib/isImage'
import { Card, CardContent } from '@/components/ui/card'
import { type ListOrder } from '@/models/pos/list-order'
import { Textarea } from '@/components/ui/textarea'
import getConfig from 'next/config'

export interface OrderProps {
  order: ListOrder
  orderAssets: string[]
  onUpdate?: () => any
}

function get(obj: any, path: string, defValue: any = undefined) {
  // If path is not defined or it has false value
  if (!path) return undefined
  // Check if path is string or array. Regex : ensure that we do not have '.' and brackets.
  // Regex explained: https://regexr.com/58j0k
  const pathArray = Array.isArray(path) ? path : (path as unknown as string).match(/([^[.\]])+/g)
  // Find value if exist return otherwise return undefined value;
  return (
    pathArray?.reduce((prevObj: any, key: string) => prevObj?.[key], obj as any) ||
    defValue
  )
}

const getFieldValueString = (item: ListOrder['items'][0], alias: string): string => {
  const fieldValues = item.productFieldValues.filter((fv) => fv.field?.alias === alias);

  return fieldValues
    .map((value) => {
      return (
        value.fieldOptionAsset?.url ??
        (value.fieldOption?.name.text as any)?.zh_Hant_HK ??
        value.fieldValue
      );
    })
    .join(", ");
}

function flatten<T>(arr: T[][]): T[] {
  return arr.reduce((acc, val) => acc.concat(val), [])
}

export const order2Lines = (order: ListOrder) =>
  [
    // [`🆔 `, `${order.id}`],
    [`👨 `, `${order.name} ${order.phoneNumber}`],
    [`🕐 `, `${dayjs(order.deliveryDate).format('MM/DD')}`, `${dayjs(order.deliveryDate).format('HH:mm')} - ${dayjs(order.deliveryDate).add(1, 'hour').format('HH:mm')}`],

    ...flatten(order.items.map((item) => [
      [`🎂 `, item.product.name.text.zh_Hant_HK, getFieldValueString(item, 'taste')],
      [`📿 `, getFieldValueString(item, 'decorations'), getFieldValueString(item, 'toppings')],
      [`‎‎‎ `, getFieldValueString(item, 'shape'), getFieldValueString(item, 'color')],
      [`‎‎ `, getFieldValueString(item, 'taste'), getFieldValueString(item, 'letter')],
      [`‎‎ `, getFieldValueString(item, 'innerTaste'), getFieldValueString(item, 'bottomTaste')],
      [`✍️️ `, getFieldValueString(item, 'sentence')],
      [`🍫️ `, getFieldValueString(item, 'paidSentence')]
    ])),

    [`📲 `, order.socialChannel, order.socialHandle],
    [`🚚 `, order.shippingOption.name.text.zh_Hant_HK, order.shippingAddress.address1, order.shippingAddress.address2],
    [`📝 `, order.remarks],
  ].map(line => line.filter(Boolean)).filter(line => line.length > 1)

const { publicRuntimeConfig } = getConfig()

function OrderCard({ order, orderAssets, onUpdate }: OrderProps) {
  const lines = useMemo(() => order2Lines(order), [order])
  const [editMode, setEditMode] = useState(false)
  const toggleEditMode = useCallback(() => setEditMode(!editMode), [editMode])

  const whatsappHref = useMemo(() => {
    const encodedLines = encodeURIComponent(lines.join("\n"))
    let href: string
    if (isMobile.any) {
      href = `whatsapp://send?text=${encodedLines}`
    } else {
      href = `https://web.whatsapp.com/send?text=${encodedLines}`
    }

    return href
  }, [lines])

  const handleShareOrder = useCallback(() => {
    if (navigator.share) {
      navigator
        .share({
          title: `Order for ${dayjs(order.deliveryDate).format("MM/DD")}`,
          text: lines.join("\n"),
          url: location.href,
        })
        .then(() => console.log("Successful share"))
        .catch((error) => console.log("Error sharing", error))
    } else {
      window.open(whatsappHref, "_blank")
    }
  }, [order.deliveryDate, lines, whatsappHref])

  const fileUploadRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const handleUploadFile = useCallback(
    async (event) => {
      const uploadedfile: File = event.target.files[0]
      if (!order.createdAt?.toISOString()) {
        return Promise.resolve()
      }

      // resize
      const resizedFile = isImage(uploadedfile.name)
        ? await new Promise<File>((resolve) => {
            const img = new Image()
            const MAX_DIMENSION = 600
            img.src = URL.createObjectURL(uploadedfile)
            img.onload = () => {
              const elem = document.createElement("canvas")
              const scaleFactor = Math.min(MAX_DIMENSION / img.width, MAX_DIMENSION / img.height)
              if (img.width > MAX_DIMENSION || img.height > MAX_DIMENSION) {
                elem.width = img.width * scaleFactor
                elem.height = img.height * scaleFactor
              } else {
                elem.width = img.width
                elem.height = img.height
              }
              const ctx = elem.getContext("2d")
              ctx?.drawImage(img, 0, 0, elem.width, elem.height)
              ctx?.canvas.toBlob(
                (blob) => {
                  const file = new File([blob!], uploadedfile.name, {
                    type: "image/jpeg",
                    lastModified: Date.now(),
                  })
                  resolve(file)
                },
                "image/jpeg",
                1
              )
            }
          })
        : uploadedfile

      setIsUploading(true)
      return getSupabase().storage
        .from("order-assets")
        .upload(
          `${order.createdAt?.toISOString()}-${new Date().toISOString()}.${uploadedfile.name
            .split(".")
            .pop()}`,
          resizedFile,
          {
            cacheControl: "3600",
            upsert: true,
          }
        )
        .then(onUpdate)
        .finally(() => setIsUploading(false))
    },
    [onUpdate, order.createdAt]
  )
  const makeHandleDeleteFile = useCallback(
    (imageName: string) => () => {
      return getSupabase().storage.from("order-assets").remove([imageName]).then(onUpdate)
    },
    [onUpdate]
  )

  return (
    <>
      <Card>
        <CardContent className="relative p-3">
        <p className={"whitespace-pre-wrap text-sm font-medium leading-6" + (orderAssets.length ? " mr-12" : "")}>
          {lines.map((line, index) => (
            <div key={index} className="my-0.5">
              {line.join(' ')}
            </div>
          ))}
        </p>
        <div className="absolute top-5 right-5 flex flex-col gap-2">
          {orderAssets.map((assetName) => (
            <div key={assetName} className="relative">
              <a
                href={`${publicRuntimeConfig.ORDER_ASSETS_CDN_URL}/order-assets/${assetName}`}
                target="_blank"
                rel="noreferrer"
                className="relative flex h-[40px] items-center justify-center overflow-hidden"
              >
                {isImage(assetName) || !assetName.includes(".") ? (
                  <img
                    src={`${publicRuntimeConfig.ORDER_ASSETS_CDN_URL}/order-assets/${assetName}`}
                    alt=""
                    width="40"
                    height="40"
                    onError={(e) =>
                      (e.currentTarget.src = e.currentTarget.src.replace(
                        /\?(.*)$/,
                        new Date().toISOString()
                      ))
                    }
                  />
                ) : (
                  <FileIcon width={25} height={25} />
                )}
              </a>
              {editMode && (
                <XIcon
                  className="absolute -top-2.5 -right-2.5 h-5 w-5 cursor-pointer rounded-full bg-white p-0.5 text-red-500 shadow-inner"
                  onClick={makeHandleDeleteFile(assetName)}
                />
              )}
            </div>
          ))}
          {editMode &&
            (isUploading ? (
              <div className="m-auto">
                <Spinner />
              </div>
            ) : (
              <div className="cursor-pointer" onClick={() => fileUploadRef.current?.click()}>
                <UploadIcon className="mx-auto h-5 w-5 cursor-pointer" />
                <input
                  className="hidden"
                  ref={fileUploadRef}
                  type="file"
                  onChange={handleUploadFile}
                />
              </div>
            ))}
        </div>
        <div className="absolute right-3 bottom-3 flex gap-2">
          <div className="flex gap-4">
            <Share2Icon className="h-5 w-5 cursor-pointer" onClick={handleShareOrder} />
            {editMode ? (
              <EyeIcon className="h-5 w-5 cursor-pointer" onClick={toggleEditMode} />
            ) : (
              <PencilIcon className="h-5 w-5 cursor-pointer" onClick={toggleEditMode} />
            )}
          </div>
        </div>
        </CardContent>
      </Card>
    </>
  )
}

export default OrderCard
