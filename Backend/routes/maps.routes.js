const express=require('express');
const router=express.Router();
const authMiddleware=require('../middlewares/auth.middleware');
const mapController=require('../controllers/mapController')
const {query}=require('express-validator');


router.get('/get-coordinates',
    query('address').isString().isLength({min:3}),
    authMiddleware.authUser,
    mapController.getCoordinates
);

router.get('/get-distance-time',
    query('origins').isString().isLength({ min: 3 }),
    query('destinations').isString().isLength({ min: 3 }),
    mapController.getDistanceTime
);

module.exports=router;