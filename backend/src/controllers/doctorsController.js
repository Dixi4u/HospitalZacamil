const  doctorsController = {};
import doctorsModel from "../models/Doctors.js"

//SELECT
doctorsController.getDoctor = async (req, res) => {
   const doctors = await doctorsModel.find()
   res.json(doctors)
}

//INSERT
doctorsController.insertDoctor = async (req, res) => {
    const { name, speciality, email, password } = req.body;
    const newDoctor = new doctorsModel({ name, speciality, email, password })
    await newDoctor.save()
    res.json({message: "Client saved"})
}

//DELETE
doctorsController.deleteDoctor = async (req, res) => {
    await doctorsModel.findByIdAndDelete(req.params.id)
    res.json({message: "Deleted successfully"})
}

//UPDATE
doctorsController.updateDoctor = async (req, res) => {
    const { name, speciality, email, password } = req.body;
    const updateDoctor = await doctorsModel.findByIdAndUpdate(req.params.id,
        {name, speciality, email, password}, {new: true}
    )
    res.json({message: "Client updated successfully"})
}

export default doctorsController;