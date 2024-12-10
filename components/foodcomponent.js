import React from "react";

const FoodComponent = ({ data, language }) => {
  return (
    <div>
      <section
        id="Projects"
        className="w-fit mx-auto grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 justify-items-center justify-center gap-y-20 gap-x-14 pt-10 mb-5"
      >
        {data.map((item, index) => (
          <div
            className="w-72 bg-white shadow-md rounded-xl duration-500 hover:scale-103 hover:shadow-xl"
            key={index}
          >
            <a href="#">
              <img
                src="https://images.unsplash.com/photo-1646753522408-077ef9839300?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwcm9maWxlLXBhZ2V8NjZ8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
                alt="Product"
                className="h-80 w-72 object-cover rounded-t-xl"
              />
              <div className="px-4 py-3 w-72">
                <p className="text-sm font-bold text-gray-600 block capitalize">
                  {language == "TR" ? item.yemekadi : item.yemekadi2}
                </p>
                <div className="flex items-center">
                  <p className="text-sm text-gray-500 cursor-auto my-3 min-h-[70px]">
                    {language == "TR" ? item.aciklama : item.aciklama2}
                  </p>
                </div>
                <hr className="pb-4 mt-2"></hr>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <p className="text-sm text-gray-500 cursor-auto mt-1">
                      <b>Kalori</b>: {item.calories} kcal
                    </p>
                  </div>
                  <div className="flex justify-end">
                    <p className="text-sm text-gray-500 cursor-auto mt-1">
                      <b>Vegan</b>:{" "}
                      {item.vegan.toLowerCase() == "no" ? "Hayır" : "Evet"}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <p className="text-sm text-gray-500 cursor-auto mt-1">
                      <b>Gluten</b>:{" "}
                      {item.gluten.toLowerCase() == "no" ? "Hayır" : "Evet"}
                    </p>
                  </div>
                  <div className="flex justify-end">
                    <p className="text-sm text-gray-500 cursor-auto mt-1">
                      <b>Alerjen</b>: {item.allergen == "" ? "Hayır" : "Evet"}
                    </p>
                  </div>
                </div>
              </div>
            </a>
          </div>
        ))}
      </section>
    </div>
  );
};

export default FoodComponent;
