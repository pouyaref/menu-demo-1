import { useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { 
  FiMenu, 
  FiX, 
  FiShoppingCart, 
  FiSearch, 
  FiStar, 
  FiPlus, 
  FiMinus,
  FiClock,
  FiChevronLeft
} from "react-icons/fi";
import { categories, menuItems } from "./data";

const MenuPage = () => {
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const filteredItems = menuItems.filter(item => 
    (selectedCategory === "all" || item.category === selectedCategory) &&
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (item) => {
    setCart(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 } 
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === id);
      if (existingItem?.quantity > 1) {
        return prev.map(item =>
          item.id === id 
            ? { ...item, quantity: item.quantity - 1 } 
            : item
        );
      }
      return prev.filter(item => item.id !== id);
    });
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);
  const deliveryTime = cart.length > 0 
    ? Math.max(...cart.map(item => item.prepTime)) + 15 
    : 0;

  return (
    <div className="min-h-screen bg-gray-50" data-theme="restaurant">
      {/* App Header with Dynamic Shadow */}
      <motion.header 
        className="sticky top-0 z-50 bg-gradient-to-r from-primary to-primary-focus text-white shadow-sm"
        initial={false}
        animate={{ 
          boxShadow: isSearchFocused ? "0 4px 20px rgba(0,0,0,0.1)" : "0 2px 10px rgba(0,0,0,0.05)"
        }}
      >
        <div className="p-4 max-w-md mx-auto">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="btn btn-ghost btn-circle text-white p-2"
              aria-label="منو"
            >
              <FiMenu size={24} />
            </button>
            
            <motion.h1 
              className="text-xl font-bold text-center"
              animate={{
                scale: isSearchFocused ? 0.8 : 1,
                opacity: isSearchFocused ? 0 : 1,
                x: isSearchFocused ? 40 : 0
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              بامر لانژ
            </motion.h1>
            
            <div className="indicator">
              <span className="indicator-item badge badge-secondary badge-sm">
                {cartItemCount}
              </span>
              <button 
                className="btn btn-ghost btn-circle text-white p-2"
                onClick={() => setIsCartOpen(true)}
                aria-label="سبد خرید"
              >
                <FiShoppingCart size={20} />
              </button>
            </div>
          </div>

          {/* Animated Search Bar */}
          <motion.div 
            className="mt-3 relative"
            layout
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <motion.div 
              className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
              animate={{ opacity: isSearchFocused ? 0 : 1 }}
            >
              <FiSearch className="text-gray-400" />
            </motion.div>
            <input
              type="text"
              placeholder="جستجوی غذا..."
              className="input input-bordered w-full pr-10 bg-white text-neutral placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent"
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              value={searchQuery}
            />
            {isSearchFocused && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 btn btn-ghost btn-sm text-gray-500"
                onClick={() => setSearchQuery("")}
              >
                <FiX size={16} />
              </motion.button>
            )}
          </motion.div>
        </div>
      </motion.header>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm"
              onClick={() => setIsSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 right-0 z-50 w-80 bg-base-100 shadow-xl"
            >
              <div className="p-4 h-full flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">منوی رستوران</h2>
                  <button 
                    onClick={() => setIsSidebarOpen(false)}
                    className="btn btn-ghost btn-circle"
                    aria-label="بستن منو"
                  >
                    <FiX size={20} />
                  </button>
                </div>
                
                <div className="space-y-3 overflow-y-auto flex-1">
                  {categories.map((cat) => (
                    <motion.button
                      key={cat.id}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center w-full p-4 rounded-xl transition-all ${
                        selectedCategory === cat.id 
                          ? "bg-primary text-white" 
                          : cat.color + " text-gray-800 hover:bg-opacity-80"
                      }`}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setIsSidebarOpen(false);
                      }}
                    >
                      <span className="text-2xl ml-3">{cat.icon}</span>
                      <span className="font-medium">{cat.name}</span>
                    </motion.button>
                  ))}
                </div>
                
                <div className="mt-auto pt-4 border-t">
                  <button className="btn btn-ghost w-full justify-start">
                    تنظیمات
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Item Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm"
              onClick={() => setSelectedItem(null)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-base-100 rounded-t-3xl shadow-xl h-[90vh] overflow-hidden"
            >
              <div className="absolute top-4 left-4 z-10">
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="btn btn-circle btn-ghost bg-white bg-opacity-80 backdrop-blur-sm"
                >
                  <FiChevronLeft size={20} />
                </button>
              </div>
              
              <div className="h-full flex flex-col">
                {/* Item Image */}
          
                
                {/* Item Content */}
                <div className="p-6 flex-1 overflow-y-auto">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold">{selectedItem.name}</h2>
                    <span className="text-xl font-bold text-primary">
                      {selectedItem.price.toLocaleString()} تومان
                    </span>
                  </div>
                  
                  <div className="flex items-center text-gray-500 mb-6">
                    <div className="flex items-center ml-4">
                      <FiClock size={16} className="ml-1" />
                      <span>{selectedItem.prepTime} دقیقه</span>
                    </div>
                    <div className="flex items-center">
                      <div className="rating rating-sm">
                        {[...Array(5)].map((_, i) => (
                          <input
                            key={i}
                            type="radio"
                            name={`rating-detail-${selectedItem.id}`}
                            className="mask mask-star-2 bg-orange-400"
                            checked={i < Math.floor(selectedItem.rating)}
                            readOnly
                          />
                        ))}
                      </div>
                      <span className="text-sm mr-1">{selectedItem.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-6">{selectedItem.description}</p>
                  
                  {selectedItem.ingredients.length > 0 && (
                    <div className="mb-6">
                      <h3 className="font-bold mb-2">مواد تشکیل دهنده:</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedItem.ingredients.map((ing, i) => (
                          <span key={i} className="badge badge-outline">
                            {ing}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg mb-6">
                    <span>کالری:</span>
                    <span className="font-bold">{selectedItem.calories} kcal</span>
                  </div>
                </div>
                
                {/* Add to cart footer */}
                <div className="p-4 border-t">
                  <button 
                    onClick={() => {
                      addToCart(selectedItem);
                      setSelectedItem(null);
                    }}
                    className="btn btn-primary w-full"
                  >
                    افزودن به سبد خرید
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm"
              onClick={() => setIsCartOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-base-100 rounded-t-3xl shadow-xl h-[85vh] overflow-hidden"
            >
              <div className="p-4 h-full flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">سبد خرید شما</h2>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="btn btn-ghost btn-circle"
                    aria-label="بستن سبد خرید"
                  >
                    <FiX size={20} />
                  </button>
                </div>
                
                {cart.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                    <FiShoppingCart size={48} className="mb-4 opacity-30" />
                    <p className="mb-2">سبد خرید شما خالی است</p>
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="btn btn-ghost text-primary"
                    >
                      بازگشت به منو
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 overflow-y-auto space-y-3 pb-4">
                      {cart.map(item => (
                        <motion.div 
                          key={item.id}
                          layout
                          className="flex items-center p-3 bg-gray-50 rounded-xl"
                        >
                          <div className="w-16 h-16 rounded-lg overflow-hidden">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 mr-3">
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-sm text-gray-500">
                              {item.price.toLocaleString()} تومان
                            </p>
                          </div>
                          <div className="flex items-center bg-white rounded-full p-1">
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="btn btn-ghost btn-sm text-error p-1"
                            >
                              <FiMinus size={14} />
                            </button>
                            <span className="mx-2 text-sm font-medium">{item.quantity}</span>
                            <button 
                              onClick={() => addToCart(item)}
                              className="btn btn-ghost btn-sm text-success p-1"
                            >
                              <FiPlus size={14} />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between">
                          <span>جمع کل:</span>
                          <span className="font-bold">{cartTotal.toLocaleString()} تومان</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>زمان تحویل:</span>
                          <span>حدود {deliveryTime} دقیقه</span>
                        </div>
                      </div>
                      <button 
                        className="btn btn-primary w-full gap-2"
                        onClick={() => {
                          setIsCartOpen(false);
                          // Here you would typically navigate to checkout
                        }}
                      >
                        <FiShoppingCart size={18} />
                        پرداخت نهایی
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="p-4 max-w-md mx-auto pb-24">
        {/* Category Chips - Horizontal Scroll */}
        <div className="mb-6 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex space-x-3 space-x-reverse w-max">
            {categories.map(cat => (
              <motion.button
                key={cat.id}
                whileTap={{ scale: 0.95 }}
                className={`whitespace-nowrap px-4 py-2 rounded-full flex items-center transition-colors ${
                  selectedCategory === cat.id
                    ? "bg-primary text-white shadow-md"
                    : cat.color + " text-gray-800 shadow-sm"
                }`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <span className="ml-2 text-lg">{cat.icon}</span>
                {cat.name}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        <LayoutGroup>
          {filteredItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 text-gray-500"
            >
              <FiSearch size={48} className="mx-auto mb-4 opacity-30" />
              <p>هیچ موردی یافت نشد</p>
              <button 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="btn btn-ghost mt-4 text-primary"
              >
                پاک کردن فیلترها
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="card card-side bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100"
                  onClick={() => setSelectedItem(item)}
                >
                  <figure className="w-28 h-28 relative flex-shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                    />
                    {item.isPopular && (
                      <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full flex items-center shadow-sm">
                        <FiStar size={10} className="ml-1" />
                        پرفروش
                      </div>
                    )}
                  </figure>
                  <div className="card-body p-4 flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="card-title text-base">{item.name}</h2>
                        <p className="text-sm text-gray-500 line-clamp-1">{item.description}</p>
                      </div>
                      <span className="badge badge-ghost badge-sm flex items-center">
                        <FiClock size={12} className="ml-1" />
                        {item.prepTime} دقیقه
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center">
                        <div className="rating rating-sm">
                          {[...Array(5)].map((_, i) => (
                            <input
                              key={i}
                              type="radio"
                              name={`rating-${item.id}`}
                              className="mask mask-star-2 bg-orange-400"
                              checked={i < Math.floor(item.rating)}
                              readOnly
                            />
                          ))}
                        </div>
                        <span className="text-xs mr-1">{item.rating.toFixed(1)}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <span className="text-sm font-bold text-primary ml-2">
                          {item.price.toLocaleString()} تومان
                        </span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(item);
                          }}
                          className="btn btn-primary btn-sm btn-circle ml-2"
                        >
                          <FiPlus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </LayoutGroup>
      </main>

      {/* Floating Cart Button */}
      {cartItemCount > 0 && (
        <motion.div 
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30 w-full max-w-md px-4"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
        >
          <motion.button 
            className="btn btn-primary shadow-xl rounded-full w-full gap-2"
            onClick={() => setIsCartOpen(true)}
            whileTap={{ scale: 0.98 }}
          >
            <div className="indicator">
              <span className="indicator-item badge badge-secondary badge-sm">
                {cartItemCount}
              </span>
              <FiShoppingCart size={18} />
            </div>
            <span>مشاهده سبد خرید</span>
            <span className="badge badge-secondary">
              {cartTotal.toLocaleString()} تومان
            </span>
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default MenuPage;