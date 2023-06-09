const carDriverService = require('../services/carDriver.service')

const getAllDrivers = async (req, res)=> {
    try  {
        const allDrivers = await carDriverService.getAllDrivers();
        if (res && res.status) {
            res.status(200).send({status: 'OK', data: allDrivers})
        }
    } catch (error) {
        console.log(error)
        if (res && res.status) {
            res.status(500).send({status: 'ERROR', data: 'Server error'})
        }
    }
}

const getOneDriver = ()=> {

}

const addDriver = ()=> {

}

const updateDriver = ()=> {

}

const deleteDriver = ()=> {

}
module.exports={getAllDrivers, getOneDriver, addDriver, updateDriver, deleteDriver}

