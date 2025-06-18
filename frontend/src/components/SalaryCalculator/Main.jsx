import React from 'react'
import { Button } from '../ui/button';

function Card({ item }) {
    return (
        <div className={`md:grid md:grid-cols-5 space-x-8 space-y-10  justify-center items-center py-8 md:py-16 px-[7%]`}>
            <div className={`col-span-2 object-cover flex justify-center items-center md:mt-10 ${item?.imgDir == "right" ? "md:hidden" : ""}`}><img className='rounded-lg h-[20rem] ' src={item.image} alt="" /></div>
            <div className="col-span-3">
                <div className="flex flex-col gap-5 lg:w-[90%]">
                    <div className="text-3xl lg:text-5xl font-bold">{item.title}</div>
                    <div className="text-lg">{item.description}</div>
                </div>
            </div>
            <div className={`col-span-2 object-cover flex justify-center items-center ${item?.imgDir == "left" ? "hidden" : "hidden md:block"}`}><img className='rounded-lg ' src={item.image} alt="" /></div>
        </div>
    )
}

function Main() {

    const data = [
        {
            title: 'Why Use Our Calculator',
            description: "Navigating the UK's Skilled Worker visa salary thresholds can be complex and time-consuming. Our calculator simplifies this process by giving you instant, reliable estimates based on current government regulations. Whether you're a business looking to sponsor international talent or an individual exploring opportunities in the UK, our tool helps you stay compliant and make informed decisions—quickly and confidently.",
            image: '/salaryCalculator/rightComp.png',
            imgDir: "right"
        },
        {
            title: 'How It Works',
            description:
                <div className='space-y-3'>
                    <p>Simple Inputs. Reliable Results.</p>
                    <ol  >
                        <li><b>1. Enter the Job Title or Occupation Code</b> – Start by selecting the specific role or Standard Occupational Classification (SOC) code.</li>
                        <li><b>2. Provide Key Details</b> – Input essential info like job location, hours per week, and applicant's age if applicable.</li>
                        <li><b>3. Get Instant Salary Guidance</b> – The calculator uses official Home Office rules to show you the minimum salary requirement for sponsorship eligibility.</li>
                        <li><b>4. Next Steps Made Easy</b> – Receive a summary and optional guidance on what to do if your offer falls short.</li>
                    </ol>
                </div>,
            image: '/salaryCalculator/leftComp.png',
            imgDir: "left"
        }
    ];

    return (
        <>
            <Card item={data[0]} />
            <Card item={data[1]} />
        </>
    )
}

export default Main