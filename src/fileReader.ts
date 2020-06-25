export class FileReader {
    public async readJsonFile(filePath: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const configXhr = new XMLHttpRequest();
            configXhr.onreadystatechange = () => {
                if (configXhr.readyState === XMLHttpRequest.DONE) {
                    if (configXhr.status === 200) {
                        resolve(JSON.parse(configXhr.responseText));
                    }
                    else {
                        console.log('Error while reading file: '+filePath);
                        reject();
                    }
                }
            };
            configXhr.open('GET', filePath, true);
            configXhr.send();
        });
    }

    public getFolderFromFilePath(filePath: string): string {
        let fileEndingIndex = filePath.lastIndexOf("/");
        return filePath.substring(0, fileEndingIndex+1);
    }
}