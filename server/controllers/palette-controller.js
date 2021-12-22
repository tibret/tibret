// Import database
import fs from 'fs';
import { join } from 'path';
import Jimp from 'jimp';

// Retrieve all monsters
export async function getPalette(req, res) {
    let paletteName = req.params.paletteName;
    let baseDir = "./public/images/"+paletteName;
    let responseData = [];

    let files = fs.readdirSync(baseDir);
    files = files.filter((file) => file.endsWith(".png") && !file.includes("clear.png"));
    files = files.sort();

    let promises = [];
    files.forEach(file => {
        let fileData = {fileName: file, id: file.replace(".png", "")};
        let fileDir = join(baseDir, file);

        let p = Jimp.read(fileDir).then(image => {
            image.getBase64Async(Jimp.MIME_PNG).then(base64 => {
                fileData.image = base64;
            });
            responseData.push(fileData);
        }).catch(err =>{
            console.error("Error reading file", err);
        });

        promises.push(p);
    });

    Promise.allSettled(promises).then((values) => {
        res.json(responseData);
    });
}
