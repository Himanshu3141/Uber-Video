import React from 'react';

const vehicleImages = {
    car: "https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg",
    moto: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_638,w_956/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png",
    auto: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png"
};

const LookingForDriver = ({ setVehicleFound, pickup, destination, fare, vehicleType }) => {
    return (
        <div>
            <h5 
                className='p-1 text-center w-[93%] absolute top-0 cursor-pointer' 
                onClick={() => setVehicleFound(false)}
            >
                <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
            </h5>
            <h3 className='text-2xl font-semibold mb-5'>Looking for a Driver</h3>

            <div className='flex gap-2 justify-between flex-col items-center'>
                <img 
                    className='h-20' 
                    src={vehicleImages[vehicleType] || vehicleImages.car} 
                    alt={vehicleType} 
                />
                <div className='w-full mt-5'>
                    {[ 
                        { icon: "ri-map-pin-user-fill", label: "Pickup", value: pickup },
                        { icon: "ri-map-pin-2-fill", label: "Destination", value: destination },
                        { icon: "ri-currency-line", label: "Fare", value: `₹${fare[vehicleType]}`, subtext: "Cash" }
                    ].map(({ icon, label, value, subtext }, index) => (
                        <div key={index} className={`flex items-center gap-5 p-3 ${index < 2 ? 'border-b-2' : ''}`}>
                            <i className={`text-lg ${icon}`}></i>
                            <div>
                                <h3 className='text-lg font-medium'>{label}</h3>
                                <p className='text-sm -mt-1 text-gray-600'>{value}</p>
                                {subtext && <p className='text-sm text-gray-600'>{subtext}</p>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LookingForDriver;
