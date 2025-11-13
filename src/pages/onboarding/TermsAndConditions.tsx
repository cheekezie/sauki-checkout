import { useEffect } from "react";

const TermsAndConditions = () => {
  useEffect(() => {
    const handleSelectStart = (e: Event) => e.preventDefault();
    const handleDragStart = (e: Event) => e.preventDefault();
    const handleContextMenu = (e: Event) => e.preventDefault();

    document.addEventListener("selectstart", handleSelectStart);
    document.addEventListener("dragstart", handleDragStart);
    document.addEventListener("contextmenu", handleContextMenu);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "c" || e.key === "a" || e.key === "v" || e.key === "x")
      ) {
        e.preventDefault();
      }
      if (e.key === "F12" || (e.ctrlKey && e.shiftKey && e.key === "I")) {
        e.preventDefault();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("selectstart", handleSelectStart);
      document.removeEventListener("dragstart", handleDragStart);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
			<div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100'>
				<div className='max-w-4xl mx-auto px-6 py-8'>
					<div className='bg-white rounded-lg shadow-lg p-8 prose prose-lg max-w-none'>
						<div className='text-center mb-12'>
							<h1 className='text-4xl font-bold text-primary mb-4'>
								TERMS AND CONDITIONS
							</h1>
							<div className='w-24 h-1 bg-primary mx-auto rounded-full'></div>
						</div>

						<section className='mb-8'>
							<h2 className='text-2xl font-bold text-gray-900 mb-4 border-l-4 border-primary pl-4'>
								INTRODUCTION
							</h2>
							<div className='text-gray-700 leading-relaxed space-y-4'>
								<p>
									Welcome to SaukiPay services of{" "}
									<span className='font-semibold text-primary'>
										Preeminent MFB & Afriwice Global Limited
									</span>
									. We start every new subscriber relationship with a contract. The
									following contract spells out what you can expect from us, and what we
									expect from you.
								</p>
								<p>
									If you agree to what you read below, You should click{" "}
									<span className='font-semibold text-primary'>"Yes"</span> at the end of
									the contract to acknowledge that you have agreed. We intend this to be
									the legal equivalent of your signature on a written contract, and
									equally binding. Only by clicking{" "}
									<span className='font-semibold text-primary'>"YES"</span>, will you be
									able to access and use the services available on this Website.
								</p>
							</div>
						</section>

						<section className='mb-8'>
							<h2 className='text-2xl font-bold text-gray-900 mb-4 border-l-4 border-primary pl-4'>
								ACCESS AND SERVICES
							</h2>
							<div className='text-gray-700 leading-relaxed space-y-4'>
								<p>
									Once subscribed, you must submit all necessary{" "}
									<span className='font-semibold'>CAC and other documents</span> before
									granting access. Full access will be granted open payment of a one time
									sign-up fee. You will be given one admin account with full access and
									can create up to{" "}
									<span className='font-semibold text-primary'>
										100 additional accounts
									</span>{" "}
									that you can decide their level of access on this system depending on
									the level of access you select.
								</p>
								<p>
									You may change or discontinue your account at any time. We reserve the
									right to modify, suspend or terminate access to the service on our
									system at any time for any reason without notice or refund, including
									the right to require you to change your login identification code or
									password. We also reserve the right to delete all program and data
									files associated with your account and/or other information you have on
									our system.
								</p>
							</div>
						</section>

						<section className='mb-8'>
							<h2 className='text-2xl font-bold text-gray-900 mb-4 border-l-4 border-primary pl-4'>
								FEES AND PAYMENT
							</h2>
							<div className='text-gray-700 leading-relaxed space-y-4'>
								<p>
									We will charge you a{" "}
									<span className='font-semibold text-primary'>
										one time sign up fee
									</span>{" "}
									for using our system. We will also charge between{" "}
									<span className='font-semibold text-primary'>N100 and N450</span>{" "}
									convenience fee per transaction depending on the amount as well as CBN
									rules.
								</p>
								<p>
									Additional charges apply to any customer that chose to use card option
									for transaction depending on CBN and card issuer institution charge as
									applicable and also depends on the charge bearer you selected during
									fee setup. You should review the complete and current price list before
									signing up for any services.
								</p>
								<p>
									Signup fee is paid to our account or by searching for us in the
									saukipay.net payment list and completing the payment procedure. You can
									cancel your account at any time, but you will remain liable for all
									charges accrued up to that time.
								</p>
								<p>
									We reserve the right to change our fees at any time for any reason but,
									whenever possible, we will give you at least
									<span className='font-semibold text-primary'>
										{" "}
										one month's advance notice
									</span>{" "}
									of such change. We will obey any CBN new charge before or after
									communicating with you and will abide by all monetary regulating policy
									in the country.
									<span className='font-semibold text-primary'>
										Value of all fees collected is settled into the merchant designated
										account on T+1
									</span>
								</p>
							</div>
						</section>

						<section className='mb-8'>
							<h2 className='text-2xl font-bold text-gray-900 mb-4 border-l-4 border-primary pl-4'>
								SYSTEM RULES
							</h2>
							<div className='text-gray-700 leading-relaxed space-y-4'>
								<p>
									You agree to be bound by certain rules that are important for the
									proper use of this service. Your failure to follow these rules, whether
									listed on the "agreement" or in bulletins posted at various points in
									the system, may result in termination of your Service.
								</p>
								<div className='bg-gray-50 p-6 rounded-lg border-l-4 border-primary'>
									<ol className='space-y-3 list-decimal list-inside'>
										<li>
											<span className='font-semibold'>
												Do not tell others your password
											</span>{" "}
											or let your account be used by anyone except by yourself and you also
											liable to any fraud committed via any sub account you created on this
											platform
										</li>
										<li>
											<span className='font-semibold'>
												Do not attempt to log in more than once
											</span>{" "}
											at the same time on any given account without specific permission of
											one of our operators
										</li>
										<li>
											While you should feel free to express yourself, you should{" "}
											<span className='font-semibold'>respect other users</span> of the
											system and not do anything to attack or injure others
										</li>
										<li>
											<span className='font-semibold'>
												Do not use our system to commit any crime
											</span>
											, or to plan, encourage or help others commit any crime, including
											crimes relating to computers and money laundry
										</li>
									</ol>
								</div>
							</div>
						</section>

						<section className='mb-8'>
							<h2 className='text-2xl font-bold text-gray-900 mb-4 border-l-4 border-primary pl-4'>
								FAILED TRANSACTIONS
							</h2>
							<div className='text-gray-700 leading-relaxed space-y-4'>
								<p>
									If any customer on the process of payment got debited but saukipay.net
									did not get the value, such customer has the duty of complaining to
									their bank to push the payment to a complete or reversal to the
									customers' account.
								</p>
								<p>
									A merchant is expected to complain through email to our customer care,
									if at any point the merchant notice any irregularity on the activity of
									their transaction such as any collection due for settlement on their
									dashboard that has not been settled after{" "}
									<span className='font-semibold text-primary'>
										10.30 pm on the due date
									</span>
								</p>
							</div>
						</section>

						<section className='mb-8'>
							<h2 className='text-2xl font-bold text-gray-900 mb-4 border-l-4 border-primary pl-4'>
								PRIVACY CONSIDERATIONS
							</h2>
							<div className='text-gray-700 leading-relaxed space-y-4'>
								<p>
									Your communications on this system are, in Most cases, viewed only by
									you and anyone to whom you address your message. However, as system
									operators, we may need to review or monitor your electronic mail and
									other communications from time to time.
								</p>
								<p>
									In addition, we reserve the right to copy and distribute to third
									parties any information associated with your activities on the system,
									Therefore, you should not expect to have a right to privacy in any of
									your communications.
								</p>
							</div>
						</section>

						<div className='mt-12 pt-8 border-t border-gray-200 text-center'>
							<p className='text-gray-600 text-sm'>
								Last updated: {new Date().toLocaleDateString()}
							</p>
							<p className='text-primary font-semibold mt-2'>
								saukipay.net - Preeminent MFB & Afriwice Global Limited
							</p>
						</div>
					</div>
				</div>
			</div>
		);
};

export default TermsAndConditions;
