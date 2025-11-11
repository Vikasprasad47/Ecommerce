import Contact from "../models/contact.model.js";

// @desc    Handle contact form submission
// @route   POST /api/contact
// @access  Public
export const submitContactForm = async (req, res) => {
  try {
    const { name, email, phone, subject, department, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res
        .status(400)
        .json({ success: false, message: "All required fields must be filled" });
    }

    const contact = await Contact.create({
      name,
      email,
      phone,
      subject,
      department,
      message,
    });

    res.status(201).json({
      success: true,
      message: "We have recived your message. We'll reply soon!",
      data: contact,
    });
  } catch (error) {
    console.error("❌ Error saving contact message:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error. Please try again later.",
    });
  }
};

/**
 * @desc  Get all contact messages
 * @route POST /api/contact/all
 * @access Admin
 */
export const getAllContactMsg = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    console.error("❌ Error fetching contacts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch contact messages.",
    });
  }
};

/**
 * @desc  Get one contact message (Admin)
 * @route POST /api/contact/single
 * @access Admin
 */
export const getSingleContactMsg = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id)
      return res.status(400).json({
        success: false,
        message: "Message ID is required",
      });

    const contact = await Contact.findById(id);
    if (!contact)
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });

    res.status(200).json({ success: true, data: contact });
  } catch (error) {
    console.error("❌ Error fetching contact:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get message details",
    });
  }
};

/**
 * @desc  Update message status (resolved/pending)
 * @route POST /api/contact/update-status
 * @access Admin
 */
export const updateContactMsgStatus = async (req, res) => {
  try {
    const { id, status } = req.body;

    if (!id || !status)
      return res.status(400).json({
        success: false,
        message: "Both 'id' and 'status' are required",
      });

    if (!["pending", "resolved"].includes(status))
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });

    const updated = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated)
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });

    res.status(200).json({
      success: true,
      message: `Message marked as ${status}`,
      data: updated,
    });
  } catch (error) {
    console.error("❌ Error updating contact:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update message status",
    });
  }
};

/**
 * @desc  Delete contact message
 * @route POST /api/contact/delete
 * @access Admin
 */
export const deleteContactMsg = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id)
      return res.status(400).json({
        success: false,
        message: "Message ID is required",
      });

    const deleted = await Contact.findByIdAndDelete(id);

    if (!deleted)
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });

    res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting contact:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete message",
    });
  }
};