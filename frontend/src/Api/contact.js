import API from "./api";

export const ContactFormSubmit = async(formData)=>{
    try{
        const response = await API.post("/contact", formData);
        return response.data;
    }catch(error){
        console.error("Contact Form Error:", error.response?.data || error.message);
        throw error;
    }
}

export const DemoFormSubmit = async(formData)=>{
    try{
        const response = await API.post("/schedule-demo", formData);
        return response.data;
    }catch(error){
        console.error("Demo Form Error:", error.response?.data || error.message);
        throw error;
    }
}
