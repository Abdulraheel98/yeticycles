/**
 * Image File to Base64
 *
 * @param {File} file
 */
export const parseImageFileToBase64 = async (file) => {
    return new Promise((resolve, reject)=>{
        let fileReader = new FileReader();

        fileReader.onload = function() {
            return resolve({
                data: fileReader.result,
                name: file.name,
                size: file.size,
                type: file.type
            });
        };
        fileReader.onerror = function(e) {
            return reject(e);
        };

        fileReader.readAsDataURL(file);
    });
};
