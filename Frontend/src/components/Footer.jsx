
import MultiflyLogo from "../assets/Multifly_Logo.png";
import FacebookIcon from "../assets/facebook.png";
import InstagramIcon from"../assets/instagram.png";
import LinkedInIcon from "../assets/linkedin.png";
import TikTokIcon from "../assets/tiktok.png";
import TwitterIcon from "../assets/twitter.png";
import YouTubeIcon from "../assets/youtube.png";

const Footer = () => {
  return (
    <footer className="bg-[#242424] text-white rounded-t-3xl pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex flex-col md:flex-row justify-between items-center md:items-start w-full space-y-6 md:space-y-0">
        {/* Logo Section */}
        <div className="flex flex-col md:w-1/3 text-center md:text-left">
          <div className="flex justify-center md:justify-start items-center">
            <img
              alt="Multifly logo"
              className="w-10 h-10 sm:w-12 sm:h-12 mr-3"
              src={MultiflyLogo}
            />
            <h2 className="text-2xl sm:text-3xl font-bold">Multifly</h2>
          </div>
          <p className="text-sm sm:text-base text-gray-400 mt-3">
            Multifly is more than just a flight <br />
            booking app; it's your one-stop shop <br />
            for seamless travel experiences.
          </p>
        </div>

        {/* Links Section */}
        <div className="flex flex-col sm:flex-row md:w-1/2 justify-center sm:justify-between gap-6 sm:gap-8 text-center md:text-left">
          {[
            {
              title: "About Us",
              items: ["Promo", "Help", "Order", "Contact", "FAQ"],
              links: ["/promo", "/help", "/order", "/contact", "/faq"],
            },
            {
              title: "Resources",
              items: [
                "Documentation",
                "Carrier",
                "Work With Us",
                "Blog & News",
                "Affiliate",
              ],
              links: [
                "/documentation",
                "/carrier",
                "/work-with-us",
                "/blog-news",
                "/affiliate",
              ],
            },
            {
              title: "Legal",
              items: [
                "Terms and Condition",
                "Privacy Policy",
                "Cookies Policy",
                "Developers",
              ],
              links: ["/terms", "/privacy", "/cookies", "/developers"],
            },
          ].map((section, index) => (
            <div key={index}>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">{section.title}</h3>
              <ul className="text-sm sm:text-base text-gray-400 space-y-2">
                {section.items.map((item, i) => (
                  <li key={i}>
                    <a
                      href={section.links[i]}
                      className="hover:text-white cursor-pointer"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact/Social Section */}
        <div className="md:w-1/4 text-center md:text-right">
          <h3 className="text-lg sm:text-xl font-semibold mb-3">Contact Us</h3>
          <ul className="text-sm sm:text-base text-gray-400 space-y-2">
            <li>Multifly@gmail.com</li>
            <li>+12 345 678 09</li>
            <li>Aurangabad, Maharashtra</li>
          </ul>

          <h3 className="text-lg sm:text-xl font-semibold mt-4 sm:mt-5 mb-3">
            Follow Us On Social
          </h3>

          <div className="flex flex-col md:flex-row justify-center md:justify-end space-y-4 md:space-y-0 md:space-x-6">
            <div className="flex space-x-4">
              <a href="https://www.facebook.com">
                <img src={FacebookIcon} alt="Facebook" className="w-6 h-6 sm:w-8 sm:h-7" />
              </a>
              <a href="https://www.twitter.com">
                <img src={TwitterIcon} alt="Twitter" className="w-6 h-6 sm:w-8 sm:h-7" />
              </a>
              <a href="https://www.linkedin.com">
                <img src={LinkedInIcon} alt="LinkedIn" className="w-6 h-6 sm:w-8 sm:h-7" />
              </a>
            </div>
            <div className="flex space-x-4">
              <a href="https://www.youtube.com">
                <img src={YouTubeIcon} alt="YouTube" className="w-6 h-6 sm:w-8 sm:h-7" />
              </a>
              <a href="https://www.instagram.com">
                <img src={InstagramIcon} alt="Instagram" className="w-6 h-6 sm:w-8 sm:h-7" />
              </a>
              <a href="https://www.tiktok.com">
                <img src={TikTokIcon} alt="TikTok" className="w-6 h-6 sm:w-8 sm:h-7" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="max-w-7xl mx-auto mt-4 sm:mt-5 text-center pb-2 sm:pb-3">
        <hr className="border-gray-600 opacity-30 mb-3" />
        <p className="text-sm sm:text-base lg:text-lg text-gray-600">
          © 2024 Multifly. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;