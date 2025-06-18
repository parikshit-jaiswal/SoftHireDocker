import { Zap } from 'lucide-react'
import { Button } from '../ui/button'

function Card({ heading, buttonText, icon }) {
    return (
        <div className="border rounded-3xl p-3 py-6 mid:py-10 flex-grow flex flex-col space-y-3">
            <span className="iconGradient rounded-full h-8 w-8 md:h-12 md:w-12 flex items-center justify-center ">
                <span className="bg-[#011627] h-6 w-6 md:h-9 md:w-9 rounded-full flex items-center justify-center">
                    {icon}
                </span>
            </span>
            <p className=" sm:text-xl lg:text-2xl font-bold mb-3 h-[50%]">{heading}</p>
            <Button className="bg-[#011627] hover:bg-[#011627] hover:opacity-90">{buttonText}</Button>
        </div>
    )
}

function Info() {

    const InfoData = [
        {
            heading: 'Get Started on your Sponsor License Application here',
            buttonText: 'Know more',
            icon: <Zap className='h-5 md:h-28' color="#ffffff" />
        },
        {
            heading: 'Learn about our Sponsorship Compliance Portal here',
            buttonText: 'Know more',
            icon:
                <svg className="text-white h-5 mid:h-[1.7rem]" width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M6.09436 11.2288C6.03221 10.8282 5.99996 10.4179 5.99996 10C5.99996 5.58172 9.60525 2 14.0526 2C18.4999 2 22.1052 5.58172 22.1052 10C22.1052 10.9981 21.9213 11.9535 21.5852 12.8345C21.5154 13.0175 21.4804 13.109 21.4646 13.1804C21.4489 13.2512 21.4428 13.301 21.4411 13.3735C21.4394 13.4466 21.4493 13.5272 21.4692 13.6883L21.8717 16.9585C21.9153 17.3125 21.9371 17.4895 21.8782 17.6182C21.8266 17.731 21.735 17.8205 21.6211 17.8695C21.4911 17.9254 21.3146 17.8995 20.9617 17.8478L17.7765 17.3809C17.6101 17.3565 17.527 17.3443 17.4512 17.3448C17.3763 17.3452 17.3245 17.3507 17.2511 17.3661C17.177 17.3817 17.0823 17.4172 16.893 17.4881C16.0097 17.819 15.0524 18 14.0526 18C13.6344 18 13.2237 17.9683 12.8227 17.9073M7.63158 22C10.5965 22 13 19.5376 13 16.5C13 13.4624 10.5965 11 7.63158 11C4.66668 11 2.26316 13.4624 2.26316 16.5C2.26316 17.1106 2.36028 17.6979 2.53955 18.2467C2.61533 18.4787 2.65322 18.5947 2.66566 18.6739C2.67864 18.7567 2.68091 18.8031 2.67608 18.8867C2.67145 18.9668 2.65141 19.0573 2.61134 19.2383L2 22L4.9948 21.591C5.15827 21.5687 5.24 21.5575 5.31137 21.558C5.38652 21.5585 5.42641 21.5626 5.50011 21.5773C5.5701 21.5912 5.67416 21.6279 5.88227 21.7014C6.43059 21.8949 7.01911 22 7.63158 22Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
        },
        {
            heading: 'Access top international tech talent through our Recruitment Portal',
            buttonText: 'Know more',
            icon:
                <svg className="text-white h-5 md:h-[1.7rem]" width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M8.99962 14C8.99962 14 10.3121 15.5 12.4996 15.5C14.6871 15.5 15.9996 14 15.9996 14M15.2496 9H15.2596M9.74962 9H9.75962M12.4996 20C17.194 20 20.9996 16.1944 20.9996 11.5C20.9996 6.80558 17.194 3 12.4996 3C7.8052 3 3.99962 6.80558 3.99962 11.5C3.99962 12.45 4.15547 13.3636 4.443 14.2166C4.55119 14.5376 4.60529 14.6981 4.61505 14.8214C4.62469 14.9432 4.6174 15.0286 4.58728 15.1469C4.55677 15.2668 4.48942 15.3915 4.35472 15.6408L2.71906 18.6684C2.48575 19.1002 2.36909 19.3161 2.3952 19.4828C2.41794 19.6279 2.50337 19.7557 2.6288 19.8322C2.7728 19.9201 3.01692 19.8948 3.50517 19.8444L8.62619 19.315C8.78127 19.299 8.85881 19.291 8.92949 19.2937C8.999 19.2963 9.04807 19.3029 9.11586 19.3185C9.18478 19.3344 9.27145 19.3678 9.44478 19.4345C10.3928 19.7998 11.4228 20 12.4996 20ZM15.7496 9C15.7496 9.27614 15.5258 9.5 15.2496 9.5C14.9735 9.5 14.7496 9.27614 14.7496 9C14.7496 8.72386 14.9735 8.5 15.2496 8.5C15.5258 8.5 15.7496 8.72386 15.7496 9ZM10.2496 9C10.2496 9.27614 10.0258 9.5 9.74962 9.5C9.47348 9.5 9.24962 9.27614 9.24962 9C9.24962 8.72386 9.47348 8.5 9.74962 8.5C10.0258 8.5 10.2496 8.72386 10.2496 9Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
        },
    ]

    return (
        // <>
        //     <div className="lg:flex gap-8 mt-[5rem] mb-[5rem] space-y-5 lg:space-y-0">
        //         <div className="border rounded-3xl p-3 py-6 mid:py-10 flex-grow flex flex-col lg:min-h-[300px]">
        //             <p className="iconGradient rounded-full h-8 w-8 md:h-12 md:w-12 flex items-center justify-center mb-8">
        //                 <p className="bg-[#011627] h-6 w-6 md:h-[2.2rem] md:w-[2.2rem] rounded-full flex items-center justify-center">
        //                     <Zap className='h-5 md:h-28' color="#ffffff" />
        //                 </p>
        //             </p>
        //             <p className="text-2xl lg:text-3xl font-bold mb-3">Get Started on your Sponsor License Application here</p>
        //             <Button className="bg-[#011627] hover:bg-[#011627] hover:opacity-90">Know more</Button>
        //         </div>
        //         <div className="border rounded-3xl p-3 py-6 mid:py-10 flex-grow flex flex-col lg:min-h-[300px]">
        //             <p className="iconGradient rounded-full h-8 w-8 md:h-12 md:w-12 flex items-center justify-center mb-8">
        //                 <p className="bg-[#011627] h-6 w-6 md:h-[2.2rem] md:w-[2.2rem] rounded-full flex items-center justify-center">
        //                     <svg className="text-white h-5 mid:h-[1.7rem]" width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        //                         <path
        //                             d="M6.09436 11.2288C6.03221 10.8282 5.99996 10.4179 5.99996 10C5.99996 5.58172 9.60525 2 14.0526 2C18.4999 2 22.1052 5.58172 22.1052 10C22.1052 10.9981 21.9213 11.9535 21.5852 12.8345C21.5154 13.0175 21.4804 13.109 21.4646 13.1804C21.4489 13.2512 21.4428 13.301 21.4411 13.3735C21.4394 13.4466 21.4493 13.5272 21.4692 13.6883L21.8717 16.9585C21.9153 17.3125 21.9371 17.4895 21.8782 17.6182C21.8266 17.731 21.735 17.8205 21.6211 17.8695C21.4911 17.9254 21.3146 17.8995 20.9617 17.8478L17.7765 17.3809C17.6101 17.3565 17.527 17.3443 17.4512 17.3448C17.3763 17.3452 17.3245 17.3507 17.2511 17.3661C17.177 17.3817 17.0823 17.4172 16.893 17.4881C16.0097 17.819 15.0524 18 14.0526 18C13.6344 18 13.2237 17.9683 12.8227 17.9073M7.63158 22C10.5965 22 13 19.5376 13 16.5C13 13.4624 10.5965 11 7.63158 11C4.66668 11 2.26316 13.4624 2.26316 16.5C2.26316 17.1106 2.36028 17.6979 2.53955 18.2467C2.61533 18.4787 2.65322 18.5947 2.66566 18.6739C2.67864 18.7567 2.68091 18.8031 2.67608 18.8867C2.67145 18.9668 2.65141 19.0573 2.61134 19.2383L2 22L4.9948 21.591C5.15827 21.5687 5.24 21.5575 5.31137 21.558C5.38652 21.5585 5.42641 21.5626 5.50011 21.5773C5.5701 21.5912 5.67416 21.6279 5.88227 21.7014C6.43059 21.8949 7.01911 22 7.63158 22Z"
        //                             stroke="currentColor"
        //                             stroke-width="2"
        //                             stroke-linecap="round"
        //                             stroke-linejoin="round"
        //                         />
        //                     </svg>
        //                 </p>
        //             </p>
        //             <p className="text-2xl lg:text-3xl font-bold mb-3">Learn about our Sponsorship Compliance Portal here</p>
        //             <Button className="bg-[#011627] hover:bg-[#011627] hover:opacity-90">Know more</Button>
        //         </div>
        //         <div className="border rounded-3xl p-3 py-6 mid:py-10 flex-grow flex flex-col lg:min-h-[300px]">
        //             <p className="iconGradient rounded-full h-8 w-8 md:h-12 md:w-12 flex items-center justify-center mb-8">
        //                 <p className="bg-[#011627] h-6 w-6 md:h-[2.2rem] md:w-[2.2rem] rounded-full flex items-center justify-center">
        //                     <svg className="text-white h-5 md:h-[1.7rem]" width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        //                         <path
        //                             d="M8.99962 14C8.99962 14 10.3121 15.5 12.4996 15.5C14.6871 15.5 15.9996 14 15.9996 14M15.2496 9H15.2596M9.74962 9H9.75962M12.4996 20C17.194 20 20.9996 16.1944 20.9996 11.5C20.9996 6.80558 17.194 3 12.4996 3C7.8052 3 3.99962 6.80558 3.99962 11.5C3.99962 12.45 4.15547 13.3636 4.443 14.2166C4.55119 14.5376 4.60529 14.6981 4.61505 14.8214C4.62469 14.9432 4.6174 15.0286 4.58728 15.1469C4.55677 15.2668 4.48942 15.3915 4.35472 15.6408L2.71906 18.6684C2.48575 19.1002 2.36909 19.3161 2.3952 19.4828C2.41794 19.6279 2.50337 19.7557 2.6288 19.8322C2.7728 19.9201 3.01692 19.8948 3.50517 19.8444L8.62619 19.315C8.78127 19.299 8.85881 19.291 8.92949 19.2937C8.999 19.2963 9.04807 19.3029 9.11586 19.3185C9.18478 19.3344 9.27145 19.3678 9.44478 19.4345C10.3928 19.7998 11.4228 20 12.4996 20ZM15.7496 9C15.7496 9.27614 15.5258 9.5 15.2496 9.5C14.9735 9.5 14.7496 9.27614 14.7496 9C14.7496 8.72386 14.9735 8.5 15.2496 8.5C15.5258 8.5 15.7496 8.72386 15.7496 9ZM10.2496 9C10.2496 9.27614 10.0258 9.5 9.74962 9.5C9.47348 9.5 9.24962 9.27614 9.24962 9C9.24962 8.72386 9.47348 8.5 9.74962 8.5C10.0258 8.5 10.2496 8.72386 10.2496 9Z"
        //                             stroke="currentColor"
        //                             stroke-width="2"
        //                             stroke-linecap="round"
        //                             stroke-linejoin="round"
        //                         />
        //                     </svg>
        //                 </p>
        //             </p>
        //             <p className="text-2xl lg:text-3xl font-bold mb-3">Access top international tech talent through our Recruitment Portal</p>
        //             <Button className="bg-[#011627] hover:bg-[#011627] hover:opacity-90">Know more</Button>
        //         </div>
        //     </div>
        // </>
        <>
            <div className="md:flex gap-8 mt-[5rem] mb-[5rem] space-y-5 lg:space-y-0">
                {InfoData.map((data, index) => (
                    <Card key={index} heading={data.heading} buttonText={data.buttonText} icon={data.icon} />
                ))}
            </div>

        </>
    )
}

export default Info