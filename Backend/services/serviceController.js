const Service = require("../Models/Service");
const HowItWork = require("../Models/HowItWork");

// Get all services
const getAllServices = async (req, res) => {
  try {
    const services = await Service.find({ isDeleted: false, isActive: true })
      .sort({ order: 1 })
      .select('-isDeleted -createdBy -updatedBy');
    
    res.status(200).json({
      success: true,
      count: services.length,
      services,
    });
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching services",
      error: error.message,
    });
  }
};

// Get single service
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.status(200).json({
      success: true,
      service,
    });
  } catch (error) {
    console.error("Error fetching service:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching service",
      error: error.message,
    });
  }
};

// Create service (Admin only)
const createService = async (req, res) => {
  try {
    const serviceData = {
      ...req.body,
      createdBy: req.admin._id,
    };

    const service = await Service.create(serviceData);

    res.status(201).json({
      success: true,
      message: "Service created successfully",
      service,
    });
  } catch (error) {
    console.error("Error creating service:", error);
    res.status(500).json({
      success: false,
      message: "Error creating service",
      error: error.message,
    });
  }
};

// Update service (Admin only)
const updateService = async (req, res) => {
  try {
    const service = await Service.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      {
        ...req.body,
        updatedBy: req.admin._id,
      },
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Service updated successfully",
      service,
    });
  } catch (error) {
    console.error("Error updating service:", error);
    res.status(500).json({
      success: false,
      message: "Error updating service",
      error: error.message,
    });
  }
};

// Delete service (Admin only)
const deleteService = async (req, res) => {
  try {
    const service = await Service.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true, updatedBy: req.admin._id },
      { new: true }
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting service:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting service",
      error: error.message,
    });
  }
};

// Get all how it works steps
const getAllHowItWorks = async (req, res) => {
  try {
    const steps = await HowItWork.find({ isDeleted: false, isActive: true })
      .sort({ order: 1, stepNumber: 1 })
      .select('-isDeleted -createdBy -updatedBy');
    
    res.status(200).json({
      success: true,
      count: steps.length,
      steps,
    });
  } catch (error) {
    console.error("Error fetching how it works:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching how it works",
      error: error.message,
    });
  }
};

// Get single how it works step
const getHowItWorkById = async (req, res) => {
  try {
    const step = await HowItWork.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!step) {
      return res.status(404).json({
        success: false,
        message: "Step not found",
      });
    }

    res.status(200).json({
      success: true,
      step,
    });
  } catch (error) {
    console.error("Error fetching step:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching step",
      error: error.message,
    });
  }
};

// Create how it works step (Admin only)
const createHowItWork = async (req, res) => {
  try {
    const stepData = {
      ...req.body,
      createdBy: req.admin._id,
    };

    const step = await HowItWork.create(stepData);

    res.status(201).json({
      success: true,
      message: "Step created successfully",
      step,
    });
  } catch (error) {
    console.error("Error creating step:", error);
    res.status(500).json({
      success: false,
      message: "Error creating step",
      error: error.message,
    });
  }
};

// Update how it works step (Admin only)
const updateHowItWork = async (req, res) => {
  try {
    const step = await HowItWork.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      {
        ...req.body,
        updatedBy: req.admin._id,
      },
      { new: true, runValidators: true }
    );

    if (!step) {
      return res.status(404).json({
        success: false,
        message: "Step not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Step updated successfully",
      step,
    });
  } catch (error) {
    console.error("Error updating step:", error);
    res.status(500).json({
      success: false,
      message: "Error updating step",
      error: error.message,
    });
  }
};

// Delete how it works step (Admin only)
const deleteHowItWork = async (req, res) => {
  try {
    const step = await HowItWork.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true, updatedBy: req.admin._id },
      { new: true }
    );

    if (!step) {
      return res.status(404).json({
        success: false,
        message: "Step not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Step deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting step:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting step",
      error: error.message,
    });
  }
};

module.exports = {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getAllHowItWorks,
  getHowItWorkById,
  createHowItWork,
  updateHowItWork,
  deleteHowItWork,
};
