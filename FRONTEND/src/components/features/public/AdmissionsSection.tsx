import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  FaUser,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaGraduationCap,
  FaPaperPlane,
  FaArrowRight,
  FaCheckCircle,
  FaTimesCircle,
  FaUserFriends,
} from "react-icons/fa";
import SectionWrapper from "../../common/SectionWrapper";
import AnimatedHeading from "../../common/AnimatedHeading";
import Card from "../../common/Card";
import Button from "../../common/Button";
import { useCMSStore } from "../../../store/cmsStore";
import { useAdmissionStore } from "../../../store/admissionStore";

const admissionSchema = z.object({
  studentName: z.string().min(2, "Student name is required"),
  parentName: z.string().min(2, "Parent/Guardian name is required"),
  phone: z
    .string()
    .regex(/^\+?\d{10,15}$/, "Enter a valid phone number (10-15 digits)"),
  email: z.string().email("Enter a valid email address"),
  age: z
    .string()
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) >= 5 && Number(val) <= 100,
      {
        message: "Enter a valid age (5-100)",
      },
    ),
  preferredClass: z.string().min(1, "Please select a class"),
  place: z.string().min(2, "Place is required"),
});

type AdmissionFormData = z.infer<typeof admissionSchema>;

const AdmissionsSection: React.FC = () => {
  const { siteContent, fetchSiteContent } = useCMSStore();
  const { submitApplication, loading } = useAdmissionStore();
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(
    null,
  );
  const [admissionOpen, setAdmissionOpen] = useState(false);

  useEffect(() => {
    if (siteContent.length === 0) fetchSiteContent();
  }, [fetchSiteContent, siteContent.length]);

  useEffect(() => {
    const admissionSetting = siteContent.find(
      (c) => c.key === "admission-open",
    );
    if (admissionSetting) {
      setAdmissionOpen(
        admissionSetting.value === "true" || admissionSetting.value === "1",
      );
    } else {
      setAdmissionOpen(false);
    }
  }, [siteContent]);

  const classOptions = [
    { value: "8th-standard", label: "8th Standard" },
    { value: "sslc", label: "SSLC Program" },
    { value: "plus-two", label: "Plus Two Program" },
    { value: "degree", label: "Degree Programs" },
    { value: "pg", label: "PG Programs" },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AdmissionFormData>({
    resolver: zodResolver(admissionSchema),
  });

  const onSubmit = async (data: AdmissionFormData) => {
    try {
      await submitApplication({
        studentName: data.studentName,
        parentName: data.parentName,
        phone: data.phone,
        email: data.email,
        age: Number(data.age),
        preferredClass: data.preferredClass,
        place: data.place,
      });
      setSubmitStatus("success");
      reset();
      setTimeout(() => setSubmitStatus(null), 6000);
    } catch (error) {
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus(null), 6000);
    }
  };

  const steps = [
    {
      step: 1,
      title: "Apply Online",
      desc: "Submit your application through our online portal",
    },
    {
      step: 2,
      title: "Document Review",
      desc: "Our admissions team reviews your credentials",
    },
    {
      step: 3,
      title: "Interview",
      desc: "Personal interview with faculty members",
    },
    {
      step: 4,
      title: "Enrollment",
      desc: "Complete enrollment and begin your journey",
    },
  ];

  const contactInfo = [
    {
      icon: FaMapMarkerAlt,
      title: "Address",
      content: "Mankery, Irimbiliyam, Malappuram, Kerala",
      color: "text-emerald-600",
    },
    {
      icon: FaPhone,
      title: "Phone",
      content: "+91 1234567890",
      color: "text-teal-500",
    },
    {
      icon: FaEnvelope,
      title: "Email",
      content: "info@sjia.edu",
      color: "text-emerald-500",
    },
  ];

  return (
    <SectionWrapper id="admissions" background="gradient">
      <div className="text-center mb-16 pt-16">
        <AnimatedHeading level={2} gradient center className="mb-4">
          {admissionOpen ? "Admission Application" : "Get In Touch"}
        </AnimatedHeading>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-lg text-gray-600 max-w-3xl mx-auto"
        >
          {admissionOpen
            ? "Join our esteemed institution and embark on a journey of academic and spiritual growth."
            : "Have questions about our programs? We're here to help!"}
        </motion.p>
      </div>

      {admissionOpen ? (
        <>
          {/* Admission Process Steps */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16"
          >
            {steps.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center relative"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 shadow-lg">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 right-0 transform translate-x-1/2">
                    <FaArrowRight className="text-emerald-300" />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>

          {/* Admission Form */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 80 }}
            className="max-w-2xl mx-auto pb-16"
          >
            <Card variant="white" className="p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Apply Now
              </h3>
              <p className="text-gray-600 mb-6">
                Complete the form below to start your admission process.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Student's Name *
                  </label>
                  <div className="input-field flex items-center gap-3 px-4">
                    <FaUser className="text-gray-400" />
                    <input
                      {...register("studentName")}
                      type="text"
                      className="flex-1 outline-none bg-transparent"
                      placeholder="Enter student's full name"
                    />
                  </div>
                  {errors.studentName && (
                    <p className="text-error text-sm mt-1">
                      {errors.studentName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Parent/Guardian Name *
                  </label>

                  <div className="input-field flex items-center gap-3 px-4">
                    <FaUserFriends className="text-gray-400" />

                    <input
                      {...register("parentName")}
                      type="text"
                      className="flex-1 outline-none bg-transparent"
                      placeholder="Enter parent/guardian name"
                    />
                  </div>

                  {errors.parentName && (
                    <p className="text-error text-sm mt-1">
                      {errors.parentName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Age *
                  </label>

                  <div className="input-field flex items-center gap-3 px-4">
                    <FaCalendarAlt className="text-gray-400" />

                    <input
                      {...register("age")}
                      type="number"
                      className="flex-1 outline-none bg-transparent"
                      placeholder="Age"
                      min={5}
                      max={100}
                    />
                  </div>

                  {errors.age && (
                    <p className="text-error text-sm mt-1">
                      {errors.age.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Place *
                  </label>

                  <div className="input-field flex items-center gap-3 px-4">
                    <FaMapMarkerAlt className="text-gray-400" />

                    <input
                      {...register("place")}
                      type="text"
                      className="flex-1 outline-none bg-transparent"
                      placeholder="City/Town"
                    />
                  </div>

                  {errors.place && (
                    <p className="text-error text-sm mt-1">
                      {errors.place.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Contact Number *
                  </label>

                  <div className="input-field flex items-center gap-3 px-4">
                    <FaPhone className="text-gray-400" />

                    <input
                      {...register("phone")}
                      type="tel"
                      className="flex-1 outline-none bg-transparent"
                      placeholder="Contact number"
                    />
                  </div>

                  {errors.phone && (
                    <p className="text-error text-sm mt-1">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>

                  <div className="input-field flex items-center gap-3 px-4">
                    <FaEnvelope className="text-gray-400" />

                    <input
                      {...register("email")}
                      type="email"
                      className="flex-1 outline-none bg-transparent"
                      placeholder="Email address"
                    />
                  </div>

                  {errors.email && (
                    <p className="text-error text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Preferred Class *
                  </label>

                  <div className="input-field flex items-center gap-3 px-4">
                    <FaGraduationCap className="text-gray-400" />

                    <select
                      {...register("preferredClass")}
                      className="flex-1 outline-none bg-transparent appearance-none"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select a class
                      </option>

                      {classOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {errors.preferredClass && (
                    <p className="text-error text-sm mt-1">
                      {errors.preferredClass.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  isLoading={loading}
                  icon={<FaPaperPlane />}
                >
                  Submit Application
                </Button>
              </form>
            </Card>
          </motion.div>
        </>
      ) : (
        <>
          {/* Contact Info Cards */}
          <div className="grid lg:grid-cols-3 gap-8 mb-12 pb-16">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card variant="white" hover className="p-6 text-center h-full">
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <info.icon className={`text-3xl ${info.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {info.title}
                  </h3>
                  <p className="text-gray-600">{info.content}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* Success/Error Modal Popup */}
      <AnimatePresence>
        {submitStatus && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSubmitStatus(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              {submitStatus === "success" ? (
                <>
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaCheckCircle className="text-emerald-500 text-4xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Application Submitted!
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Jazakallahu Khairan! Your application has been submitted
                    successfully. We will review your details and contact you
                    soon, In Sha Allah.
                  </p>
                  <p className="text-sm text-gray-500 mb-6">
                    A confirmation email has been sent to your email address.
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => setSubmitStatus(null)}
                  >
                    Close
                  </Button>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaTimesCircle className="text-red-500 text-4xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Submission Failed
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Something went wrong while submitting your application.
                    Please try again or contact us directly.
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => setSubmitStatus(null)}
                  >
                    Try Again
                  </Button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SectionWrapper>
  );
};

export default AdmissionsSection;
