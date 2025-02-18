const express=require('express');
const router=express.Router();
const {body,query}=require('express-validator');
const rideController=require('../controllers/ride.controller')
const authMiddleware=require('../middlewares/auth.middleware')



router.post('/create',
    [
        body('pickup').notEmpty().withMessage('Pickup location is required'),
        body('destination').notEmpty().withMessage('Destination is required'),
        body('vehicleType').notEmpty().withMessage('Vehicle type is required').isIn(['auto', 'car', 'motorcycle']).withMessage('Vehicle type must be one of auto, car, motorcycle')
    ],
    authMiddleware.authUser,
    rideController.createRide
)
router.get('/get-fare',
    authMiddleware.authUser,
    query('pickup').isString().isLength({ min: 3 }).withMessage('Invalid pickup address'),
    query('destination').isString().isLength({ min: 3 }).withMessage('Invalid destination address'),
    rideController.getFare
)

router.post('/confirm',
    authMiddleware.authCaptain,
    body('rideId').isMongoId().withMessage('Invalid ride id'),
    rideController.confirmRide
)

router.get('/start-ride',
    authMiddleware.authCaptain,
    query('rideId').isMongoId().withMessage('Invalid ride id'),
    query('otp').isString().isLength({ min: 6, max: 6 }).withMessage('Invalid OTP'),
    rideController.startRide
)

router.post('/end-ride',
    authMiddleware.authCaptain,
    body('rideId').isMongoId().withMessage('Invalid ride id'),
    rideController.endRide
)

module.exports=router;