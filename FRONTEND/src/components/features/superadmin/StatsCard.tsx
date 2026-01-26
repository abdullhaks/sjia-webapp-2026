import React from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { IconType } from 'react-icons';

interface StatsCardProps {
    title: string;
    value: number;
    icon: IconType;
    color?: string; // Tailwind color class like 'text-blue-500' or hex if using style
    trend?: {
        value: number;
        isPositive: boolean;
    };
    suffix?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, color = 'text-primary', trend, suffix = '' }) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all"
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
                    <h3 className="text-3xl font-bold text-gray-800">
                        <CountUp end={value} duration={2} separator="," suffix={suffix} />
                    </h3>
                    {trend && (
                        <div className={`flex items-center mt-2 text-sm font-medium ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                            <span>{trend.isPositive ? '↑' : '↓'} {trend.value}%</span>
                            <span className="text-gray-400 ml-1">vs last month</span>
                        </div>
                    )}
                </div>
                <div className={`p-4 rounded-xl bg-gray-50 ${color}`}>
                    <Icon className="text-2xl" />
                </div>
            </div>
        </motion.div>
    );
};

export default StatsCard;
