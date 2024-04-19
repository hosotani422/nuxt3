/**
 * ファイル書込
 *
 * @param fileName ファイル名
 * @param fileText ファイル内容
 * @param success 成功時コールバック
 * @param failure 失敗時コールバック
 */
export const write = (
  fileName: string,
  fileText: string,
  success: (filePath: string) => void,
  failure: (errorCode: number) => void,
): void => {
  window.resolveLocalFileSystemURL(
    window.cordova?.file.externalRootDirectory,
    (directoryEntry) => {
      directoryEntry.getFile(
        fileName,
        { create: true, exclusive: false },
        (fileEntry) => {
          fileEntry.createWriter(
            (fileWriter) => {
              fileWriter.onwriteend = () => {
                success(fileEntry.fullPath);
              };
              fileWriter.write(new Blob([fileText], { type: `text/plain` }));
            },
            (fileError) => {
              failure(fileError.code);
            },
          );
        },
        (fileError) => {
          failure(fileError.code);
        },
      );
    },
    (fileError) => {
      failure(fileError.code);
    },
  );
};

export default {
  write,
};
