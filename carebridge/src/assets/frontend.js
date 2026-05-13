// Cloth
import logo from './logo.png'
import Cloth from './Cloth.png'
import food from './Food.png'

import add_icon_white from './add_icon_white.png'
import add_icon_green from './add_icon_green.png'
import remove_icon_red from './remove_icon_red.png'
import profile_icon from './profile_icon.png'
import logout_icon from './logout_icon.png'
import bag_icon from './bag_icon.png'

// Male clothing
import Cimage1 from './Cimage1.png'
import Cimage2 from './Cimage2.png'
import Cimage3 from './Cimage3.png'
import Cimage4 from './Cimage4.png'
import Cimage5 from './Cimage5.png'
import Cimage6 from './Cimage6.png'

import CMale from './CMale.png'
import CMaleimage2 from './CMaleimage2.png'
import CMaleimage3 from './CMaleimage3.png'
import CMaleimage4 from './CMaleimage4.png'
import CMaleimage5 from './CMaleimage5.png'
import CMaleimage6 from './CMaleimage6.png'

// Women clothing
import CWomen from './CWomen.png'
import CWomenImage1 from './CWomenImage1.png'
import CWomenImage2 from './CWomenImage2.png'
import CWomenImage3 from './CWomenImage3.png'

// Boys clothing
import CBoy from './CBoy.png'
import CBoy1 from './CBoy1.png'
import CBoy2 from './CBoy2.png'
import CBoy3 from './CBoy3.png'
import CBoy4 from './CBoy4.png'

// Girls clothing
import CGirl from './CGirl.png'
import CGirl1 from './CGirl1.png'
import CGirl2 from './CGirl2.png'
import CGirl3 from './CGirl3.png'

// Veg & Non-Veg
import veg from './veg.png'
import veg1 from './veg1.png'
import veg2 from './veg2.png'
import veg3 from './veg3.png'
import veg4 from './veg4.png'

import non_veg from './non-veg.png'
import non_veg1 from './non-veg1.png'
import non_veg2 from './non-veg2.png'
import non_veg3 from './non-veg3.png'
import non_veg4 from './non-veg4.png'

// Education
import Education from './Education.png'
import Eimage1 from './Eimage1.png'
import Eimage2 from './Eimage2.png'
import Eimage3 from './Eimage3.png'
import Eimage4 from './Eimage4.png'
import Eimage5 from './Eimage5.png'
import Eimage6 from './Eimage6.png'
import Eimage7 from './Eimage7.png'
import Eimage8 from './Eimage8.png'
import Eimage9 from './Eimage9.png'
import Eimage10 from './Eimage10.png'
import search_icon from './search_icon.png'
import basket_icon from './basket_icon.png'



export const foodDonations = [];

export const assets = {
  add_icon_green,
  add_icon_white,
  remove_icon_red,
  search_icon,
  basket_icon,
  logo,
  logout_icon,
  profile_icon,
  bag_icon
}

// ---------------- Menus ----------------
export const menu_list = [
  { menu_name: "food", menu_image: food },
  { menu_name: "education", menu_image: Education },
  { menu_name: "cloth", menu_image: Cloth }
]

export const All_menu = [
  { menu_name: "veg", menu_image: veg, category: "food" },
  { menu_name: "non-veg", menu_image: non_veg, category: "food" },
  { menu_name: "women", menu_image: CWomen, category: "cloth" },
  { menu_name: "men", menu_image: CMale, category: "cloth" },
  { menu_name: "boys", menu_image: CBoy, category: "cloth" },
  { menu_name: "girls", menu_image: CGirl, category: "cloth" },
  { menu_name: "education", menu_image: Eimage1, category: "education" }
]

export const menu = [
  // Boys
  { _id: "1", name: "Boys Outfit Set", image: CBoy, price: 25, description: "Trendy jacket set for boys, perfect for casual outings.", category: "boys" },
  { _id: "2", name: "Boys Denim Set", image: CBoy1, price: 20, description: "Comfortable denim shirt and jeans combo.", category: "boys" },
  { _id: "3", name: "Boys Casual Wear", image: CBoy2, price: 18, description: "Light casual wear with shirt and pants for boys.", category: "boys" },
  { _id: "4", name: "Boys Winter Suit", image: CBoy3, price: 30, description: "Warm winter wear with cap and overalls.", category: "boys" },
  { _id: "5", name: "Boys Dungarees", image: CBoy4, price: 22, description: "Stylish dungaree with long-sleeve top.", category: "boys" },

  // Girls
  { _id: "6", name: "Girls Fashion Set", image: CGirl, price: 28, description: "Trendy tops and jeans for girls, fashionable and comfy.", category: "girls" },
  { _id: "7", name: "Girls Casual Tops", image: CGirl1, price: 24, description: "Colorful casual tops for everyday wear.", category: "girls" },
  { _id: "8", name: "Girls Winter Jacket", image: CGirl2, price: 35, description: "Warm and stylish jackets for winter days.", category: "girls" },
  { _id: "9", name: "Girls Outfit Collection", image: CGirl3, price: 26, description: "Trendy and colorful outfit sets for girls.", category: "girls" },

  // Men
  { _id: "10", name: "Formal Suit", image: Cimage1, price: 50, description: "Elegant formal suit for special occasions.", category: "men" },
  { _id: "11", name: "Formal Suit", image: Cimage2, price: 80, description: "Elegant suit for formal events.", category: "men" },
  { _id: "12", name: "Blue Blazer", image: Cimage3, price: 60, description: "Stylish blazer for men.", category: "men" },
  { _id: "13", name: "Traditional Kurta", image: Cimage4, price: 50, description: "Cultural attire for festivals.", category: "men" },
  { _id: "14", name: "Winter Jacket", image: Cimage5, price: 70, description: "Warm jacket for winter wear.", category: "men" },
  { _id: "15", name: "Red Sweatshirt", image: Cimage6, price: 40, description: "Trendy sweatshirt for casual wear.", category: "men" },
  { _id: "16", name: "Suit Black", image: CMaleimage2, price: 85, description: "Black suit for office wear.", category: "men" },
  { _id: "17", name: "Blue Coat", image: CMaleimage3, price: 65, description: "Blue men’s coat.", category: "men" },
  { _id: "18", name: "Kurta Set", image: CMaleimage4, price: 55, description: "Traditional men’s wear.", category: "men" },
  { _id: "19", name: "Sports Jacket", image: CMaleimage5, price: 75, description: "Comfortable sports jacket.", category: "men" },
  { _id: "20", name: "Red Full Sleeve", image: CMaleimage6, price: 42, description: "Trendy red sweatshirt.", category: "men" },

  // Women
  { _id: "21", name: "Women Dress 1", image: CWomenImage1, price: 95, description: "Elegant women’s outfit.", category: "women" },
  { _id: "22", name: "Women Dress 2", image: CWomenImage2, price: 110, description: "Colorful saree collection.", category: "women" },
  { _id: "23", name: "Women Lehenga", image: CWomenImage3, price: 120, description: "Designer lehenga for women.", category: "women" },

  // Education
  { _id: "24", name: "Books and Globe", image: Eimage1, price: 0, description: "Books with globe on desk.", category: "education" },
  { _id: "25", name: "Study Desk", image: Eimage2, price: 0, description: "Desk with globe and books.", category: "education" },
  { _id: "26", name: "Open Book", image: Eimage3, price: 0, description: "Book with study lamp.", category: "education" },
  { _id: "27", name: "World Globe", image: Eimage4, price: 0, description: "Globe with books and pens.", category: "education" },
  { _id: "28", name: "Pencils & Colors", image: Eimage5, price: 0, description: "Stationery collection.", category: "education" },
  { _id: "29", name: "Study Table", image: Eimage6, price: 0, description: "Books and lamp on table.", category: "education" },
  { _id: "30", name: "School Supplies", image: Eimage7, price: 0, description: "Stack of stationery supplies.", category: "education" },
  { _id: "31", name: "School Building", image: Eimage8, price: 0, description: "Exterior view of school.", category: "education" },
  { _id: "32", name: "Classroom", image: Eimage9, price: 0, description: "Teacher and students inside classroom.", category: "education" },
  { _id: "33", name: "Books with Candle", image: Eimage10, price: 0, description: "Books stacked with light.", category: "education" },

  // Veg
  { _id: "34", name: "Veg Platter", image: veg, price: 20, description: "Delicious vegetarian platter.", category: "veg" },
  { _id: "35", name: "Veg Dish", image: veg1, price: 18, description: "Tasty veg dish with curry.", category: "veg" },
  { _id: "36", name: "Veg Curry Set", image: veg2, price: 22, description: "Full veg thali set.", category: "veg" },
  { _id: "37", name: "Mix Veg Curry", image: veg3, price: 19, description: "Mix veg curry dish.", category: "veg" },
  { _id: "38", name: "Idli & Curry", image: veg4, price: 15, description: "Idli served with veg curry.", category: "veg" },

  // Non-Veg
  { _id: "39", name: "Chicken Curry", image: non_veg, price: 28, description: "Spicy chicken curry.", category: "non-veg" },
  { _id: "40", name: "Fried Chicken", image: non_veg1, price: 30, description: "Crispy fried chicken.", category: "non-veg" },
  { _id: "41", name: "Chicken Platter", image: non_veg2, price: 35, description: "Chicken with spices platter.", category: "non-veg" },
  { _id: "42", name: "Chicken Roast", image: non_veg3, price: 32, description: "Roasted chicken dish.", category: "non-veg" },
  { _id: "43", name: "Chicken Wings", image: non_veg4, price: 27, description: "Crispy chicken wings.", category: "non-veg" }
]
