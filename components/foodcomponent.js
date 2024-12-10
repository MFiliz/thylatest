import React from "react";
import { translations } from "@/lib/languageconstant";
const FoodComponent = ({ data, language }) => {
  return (
    <div>
      <section
        id="Projects"
        className="w-fit mx-auto grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 justify-items-center justify-center gap-y-20 gap-x-14 mb-5 pb-10"
        style={{ paddingTop: 100 }}
      >
        {data.map((item, index) => (
          <div
            className="w-72 bg-white shadow-md rounded-xl duration-500 hover:scale-103 hover:shadow-xl"
            key={index}
          >
            <div>
              <img
                src="https://borsamutfak.com/wp-content/uploads/2024/07/Turk-Hava-Yollari-Haziran-2024-Trafik-Verilerini-Acikladi-990x557.jpg"
                alt="Product"
                className="h-80 w-72 object-cover rounded-t-xl"
                style={{
                  filter: true ? "blur(2px)" : "none",
                  transition: "filter 0.1s ease",
                }}
              />
              <div className="px-4 py-3 w-72">
                <p className="text-sm font-bold text-gray-600 block capitalize min-h-[35px]">
                  {language == "TR" ? item.yemekadi : item.yemekadi2}
                </p>
                <div className="min-h-[30px]">
                  <small className="text-xs text-gray-400 cursor-auto mb-3 ">
                    {language == "TR" ? item.eslikci : item.eslikci2}
                  </small>
                </div>
                <div className="flex items-center">
                  <p className="text-sm text-gray-500 cursor-auto min-h-[70px]">
                    {language == "TR" ? item.aciklama : item.aciklama2}
                  </p>
                </div>

                <hr className="pb-4 mt-2"></hr>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <p className="text-sm text-gray-500 cursor-auto mt-1">
                      <b>{translations[language].kalori}</b>: {item.calories}{" "}
                      kcal
                    </p>
                  </div>
                  <div className="flex justify-end">
                    <p className="text-sm text-gray-500 cursor-auto mt-1">
                      <b>{translations[language].vegan}</b>:{" "}
                      {item.vegan.toLowerCase() == "no"
                        ? translations[language].hayir
                        : translations[language].evet}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <p className="text-sm text-gray-500 cursor-auto mt-1">
                      <b>{translations[language].gluten}</b>:{" "}
                      {item.gluten.toLowerCase() == "no"
                        ? translations[language].hayir
                        : translations[language].evet}
                    </p>
                  </div>
                  <div className="flex justify-end">
                    <p className="text-sm text-gray-500 cursor-auto mt-1">
                      <b>{translations[language].alerjen}</b>:{" "}
                      {item.allergen == ""
                        ? translations[language].hayir
                        : translations[language].evet}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default FoodComponent;
