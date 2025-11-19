import Medicine from "../models/Medicines.js";

export const createMedicine = async (req, res) => {
    try {
        const medicine = await Medicine.create({
            ...req.body,
            createdBy: req.user._id,
        });

        return res.json({
            success: true,
            message: "Medicine added",
            medicine,
        });
    } catch (err) {
        return res.json({ success: false, message: err.message });
    }
};

export const getMedicines = async (req, res) => {
    try {
        const { search, category } = req.query;

        let filter = {};

        if (search) {
            filter.name = { $regex: search, $options: "i" };
        }

        if (category) {
            filter.category = category;
        }

        const medicines = await Medicine.find(filter).sort({ createdAt: -1 });

        return res.json({ success: true, medicines });
    } catch (err) {
        return res.json({ success: false, message: err.message });
    }
};

export const getMedicineById = async (req, res) => {
    try {
        const medicine = await Medicine.findById(req.params.id);

        if (!medicine)
            return res.json({ success: false, message: "Not found" });

        return res.json({ success: true, medicine });
    } catch (err) {
        return res.json({ success: false, message: err.message });
    }
};

export const updateMedicine = async (req, res) => {
    try {
        const medicine = await Medicine.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!medicine)
            return res.json({ success: false, message: "Not found" });

        return res.json({
            success: true,
            message: "Medicine updated",
            medicine,
        });
    } catch (err) {
        return res.json({ success: false, message: err.message });
    }
};

export const deleteMedicine = async (req, res) => {
    try {
        const medicine = await Medicine.findByIdAndDelete(req.params.id);

        if (!medicine)
            return res.json({ success: false, message: "Not found" });

        return res.json({
            success: true,
            message: "Medicine removed",
        });
    } catch (err) {
        return res.json({ success: false, message: err.message });
    }
};

export const reduceStock = async (req, res) => {
    try {
        const { medicineId, quantity } = req.body;

        const medicine = await Medicine.findById(medicineId);

        if (!medicine)
            return res.json({ success: false, message: "Not found" });

        if (medicine.stock < quantity)
            return res.json({
                success: false,
                message: "Not enough stock",
            });

        medicine.stock -= quantity;
        await medicine.save();

        return res.json({
            success: true,
            message: "Stock updated",
            medicine,
        });
    } catch (err) {
        return res.json({ success: false, message: err.message });
    }
};
