// const ImageKit = require("@imagekit/nodejs");
// const { toFile } = require("@imagekit/nodejs");
const galleryModel = require("../models/gallery.model");


// const client = new ImageKit({
//     privateKey: process.env['IMAGEKIT_PRIVATE_KEY'], // This is the default and can be omitted
// });


const getGalleryImage = async (req, res) => {
    try {
        const { order } = req.query
        const galleryData = await galleryModel.find({ user: req.userId }).sort({ createdAt: order === "newest" ? -1 : 1 })

        res.status(200).json({
            success: true,
            data: galleryData
        })
    } catch (error) {
        res.status(400).json({
            succes: false,
            message: error.message
        })
    }

}

const addGalleryImage = async (req, res) => {
    try {
        //? image kit code

        // const image = await client.files.upload({
        //     file: await toFile(Buffer.from(req.file.buffer), 'file'),
        //     fileName: req.file.originalname,
        //     folder: "hr-system"
        // });

        // const addedImage = await galleryModel.create({
        //     user: req.userId,
        //     image_url: image.url
        // })

        // return res.status(201).json({
        //     succes: true,
        //     message: "Image added",
        //     data: addedImage
        // })

        const file = req.file.filename

        const addedImage = await galleryModel.create({
            user: req.userId,
            image_url: `${process.env.PORT}/uploads/images/${file}`
        })

        res.status(201).json({
            success: true,
            message: "Image Added",
            data: addedImage
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }



}

const getGalleryImageById = async (req, res) => {
    const id = req.params.id
    const user = req.userId
    try {
        const image = await galleryModel.findById(id)

        if (!image) {
            return res.status(404).json({
                success: false,
                message: "Image not found"
            })
        }

        const isAuthenticated = image.user.toString() === user

        if (!isAuthenticated) {
            return res.status(403).json({    // forbidden
                success: false,
                message: " You're not allowed to access this resource"
            })

        }

        return res.status(200).json({
            success: true,
            data: image
        })

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }

}

const deleteGalleryImageById = async (req, res) => {
    const id = req.params.id

    try {
        await galleryModel.deleteById(id)

        return res.json({
            success: true,
            message: "Image has been deleted"
        })

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}


module.exports = { getGalleryImage, addGalleryImage, getGalleryImageById, deleteGalleryImageById }


// MongoDB document size limit = 16MB max

// Large arrays = slower updates

// Entire document rewritten on every push

// Harder pagination

// Harder delete single image

// Harder indexing


// Small documents

// Indexed per image

// Easy pagination

// Easy sorting

// Easy delete

// No 16MB risk

// No large document rewrites

// Better scaling


//! with array approach everytime i push a document mongodb rewrites the while document internally
//! Many small documents scale better than one growing document due to MongoDB’s 16MB document limit and write performance behavior.

// const addGalleryImage = async (req, res) => {
//     try {
//         const image = await client.files.upload({
//             file: await toFile(Buffer.from(req.file.buffer), 'file'),
//             fileName: req.file.originalname,
//             folder: "hr-system"
//         });

//         const isUserExist = await galleryModel.findOne({ user: req.userId })

//         if (!isUserExist) {

//             const addedImage = await galleryModel.create({
//                 user: req.userId,
//                 image_uri: image.url
//             })

//             return res.status(201).json({
//                 succes: true,
//                 message: "Image added",
//                 data: addedImage
//             })
//         }

//         isUserExist.image_uri.push(image.url)
//         await isUserExist.save()
//         res.status(200).json({
//             success: true,
//             message: "gallery updated",
//             data: isUserExist
//         })



//     } catch (error) {
//         res.status(400).json({
//             succes: false,
//             message: error.message
//         })
//     }



// }





