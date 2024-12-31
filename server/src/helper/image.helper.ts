import { fileTypeFromBuffer } from 'file-type'

const acceptFileTypes = ['image/jpeg', 'image/png']

export const ImageHelper = {
    isImage: async function (fileArrayBuffer: ArrayBuffer): Promise<boolean> {
        // const buffer = await file.arrayBuffer()
        const fileTypeResult = await fileTypeFromBuffer(fileArrayBuffer)
        if (fileTypeResult == undefined)
            return false
        return acceptFileTypes.includes(fileTypeResult.mime)
    }
}