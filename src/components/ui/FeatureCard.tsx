import { CheckCircle, GraduationCap, School } from "lucide-react";
import type { FeatureCardProps } from "../../interface";

export default function FeatureCard({
  heading,
  items,
  className = "",
  selectedType = "school",
}: FeatureCardProps) {
  return (
			<div
				className={`w-full bg-white border border-gray-200 rounded-lg p-6 md:p-8 shadow-sm ${className}`}>
				<div className='flex items-start justify-between gap-6 md:gap-8'>
					<div className='flex-1'>
						<h2 className='text-xl font-semibold text-gray-900 mb-4 md:mb-6 leading-snug'>
							{heading}
						</h2>
						<ul className='space-y-3.5'>
							{items.map((text) => (
								<li key={text} className='flex items-center gap-3'>
									<CheckCircle className='w-5 h-5 text-primary flex-shrink-0' />
									<span className='text-primary font-medium'>{text}</span>
								</li>
							))}
						</ul>
					</div>
					<div className='hidden sm:block flex-shrink-0'>
						<div className='w-24 h-24 bg-primary/5 rounded-2xl flex items-center justify-center'>
							{selectedType === "school" ? (
								<GraduationCap className='w-14 h-14 text-primary' />
							) : (
								<School className='w-14 h-14 text-primary' />
							)}
						</div>
					</div>
				</div>
			</div>
		);
}
