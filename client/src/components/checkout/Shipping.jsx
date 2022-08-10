import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setShipping } from '../../redux/slices/shippingSlice';

const Shipping = ({ setCurrPage }) => {
  const [shippingData, setShippingData] = useState({
    province: '',
    city: '',
    district: 'default',
    postalCode: '',
    address: '',
    expedition: '',
  });

  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingData({ ...shippingData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !shippingData.province ||
      !shippingData.city ||
      !shippingData.district ||
      !shippingData.postalCode ||
      !shippingData.address ||
      !shippingData.expedition
    ) {
      return dispatch({
        type: 'alert/alert',
        payload: {
          error: 'Please provide all shipping information.',
        },
      });
    }

    dispatch(setShipping(shippingData));
    setCurrPage('payment');
  };

  useEffect(() => {
    const tempShippingData = JSON.parse(
      localStorage.getItem('learnify_shipping')
    );
    if (tempShippingData) {
      setShippingData(tempShippingData);
    }
  }, []);

  return (
    <div className="mt-8 font-opensans md:h-[70vh] overflow-auto hide-scrollbar">
      <h1 className="text-2xl mb-6">Shipping</h1>
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-7">
          <div className="mb-6 flex-1">
            <label htmlFor="province" className="text-gray-500">
              Province (Oblast)
            </label>
            <select
              id="province"
              name="province"
              value={shippingData.province}
              onChange={handleChange}
              className="w-full outline-0 p-2 rounded-md border border-gray-300 bg-white mt-3 text-sm"
            >
              <option value="">- Select Province -</option>
              <option value="Cherkasy Oblast">Cherkasy Oblast</option>
              <option value="Chernihiv Oblast"> Chernihiv Oblast</option>
              <option value="Chernivtsi Oblast">Chernivtsi Oblast</option>
              <option value="Donetsk Oblast">Donetsk Oblast</option>
              <option value="Kharkiv Oblast">Kharkiv Oblast</option>
              <option value="Kherson Oblast">Kherson Oblast</option>
              <option value="Khmelnytskyi Oblast">Khmelnytskyi Oblast</option>
              <option value="Kyiv Oblast">Kyiv Oblast</option>
              <option value="Kirovohrad Oblast">Kirovohrad Oblast</option>
              <option value="Luhansk Oblast">Luhansk Oblast</option>
              <option value="Lviv Oblast">Lviv Oblast</option>
              <option value="Mykolaiv Oblast">Mykolaiv Oblast</option>
              <option value="Odessa Oblast">Odessa Oblast</option>
              <option value="Poltava Oblast">Poltava Oblast</option>
              <option value="Sumy Oblast">Sumy Oblast</option>
              <option value="Ternopil Oblast">Ternopil Oblast</option>
              <option value="Vinnytsia Oblast">Vinnytsia Oblast</option>
              <option value=" Volyn Oblast">Zakarpattia Oblast</option>
              <option value="Zaporizhzhia Oblast">Zaporizhzhia Oblast</option>
              <option value="Zhytomyr Oblast">Zhytomyr Oblast</option>
            </select>
          </div>
          <div className="mb-6 flex-1">
            <label htmlFor="city" className="text-gray-500">
              City
            </label>
            <select
              id="city"
              name="city"
              value={shippingData.city}
              onChange={handleChange}
              className="w-full outline-0 p-2 rounded-md border border-gray-300 bg-white mt-3 text-sm"
            >
              <option value="">- Select City -</option>
              <option value="Cherkasy">Cherkasy</option>
              <option value="Chernihiv"> Chernihiv</option>
              <option value="Chernivtsi">Chernivtsi</option>
              <option value="Donetsk">Donetsk</option>
              <option value="Kharkiv">Kharkiv</option>
              <option value="Kherson">Kherson</option>
              <option value="Khmelnytskyi">Khmelnytskyi</option>
              <option value="Kyiv">Kyiv</option>
              <option value="Kirovohrad">Kirovohrad</option>
              <option value="Luhansk">Luhansk</option>
              <option value="Lviv">Lviv</option>
              <option value="Mykolaiv">Mykolaiv</option>
              <option value="Odessa">Odessa</option>
              <option value="Poltava">Poltava</option>
              <option value="Sumy">Sumy</option>
              <option value="Ternopil">Ternopil</option>
              <option value="Vinnytsia">Vinnytsia</option>
              <option value=" Volyn">Zakarpattia</option>
              <option value="Zaporizhzhia">Zaporizhzhia</option>
              <option value="Zhytomyr">Zhytomyr</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-7">
          <div className="mb-6 flex-1">
            <label htmlFor="district" className="text-gray-500">
              District
            </label>
            <input
              type="text"
              autoComplete="off"
              id="district"
              name="district"
              value={shippingData.district}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md outline-0 p-2 text-sm mt-3"
              placeholder={shippingData.district}
            />
          </div>
          <div className="mb-6 flex-1">
            <label htmlFor="city" className="text-gray-500">
              Postal Code
            </label>
            <input
              type="text"
              autoComplete="off"
              id="postalCode"
              name="postalCode"
              value={shippingData.postalCode}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md outline-0 p-2 text-sm mt-3"
            />
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="address" className="text-gray-500">
            Address
          </label>
          <textarea
            id="address"
            name="address"
            value={shippingData.address}
            onChange={handleChange}
            className="w-full border border-gray-300 outline-0 rounded-md mt-3 text-sm p-2 resize-none"
          />
        </div>
        <div>
          <p className="text-gray-500">Select Expedition</p>
          <div className="flex items-center gap-16 mt-4">
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="expedition"
                id="DHL"
                value="DHL"
                onChange={handleChange}
                checked={shippingData.expedition === 'DHL' ? true : false}
              />
              <label htmlFor="jne">
                <img
                  src={`${process.env.PUBLIC_URL}/images/dhl.png`}
                  alt="DHL"
                  width={50}
                />
              </label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="expedition"
                id="nova"
                value="nova"
                onChange={handleChange}
                checked={shippingData.expedition === 'nova' ? true : false}
              />
              <label htmlFor="pos">
                <img
                  src={`${process.env.PUBLIC_URL}/images/nova.png`}
                  alt="Nova Poshta"
                  width={50}
                />
              </label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="expedition"
                id="ukrposhta"
                value="ukrposhta"
                onChange={handleChange}
                checked={shippingData.expedition === 'ukrposhta' ? true : false}
              />
              <label htmlFor="ukrposhta">
                <img
                  src={`${process.env.PUBLIC_URL}/images/ukr.png`}
                  alt="Ukrposhta"
                  width={50}
                />
              </label>
            </div>
          </div>
        </div>

        <button
          disabled={
            !shippingData.province ||
            !shippingData.city ||
            !shippingData.district ||
            !shippingData.postalCode ||
            !shippingData.address ||
            !shippingData.expedition
              ? true
              : false
          }
          className={`mt-6 ${
            !shippingData.province ||
            !shippingData.city ||
            !shippingData.district ||
            !shippingData.postalCode ||
            !shippingData.address ||
            !shippingData.expedition
              ? 'bg-blue-300 hover:bg-blue-300'
              : 'bg-[#3552DC] hover:bg-[#122DB0]'
          } transition-[background] rounded-md text-sm text-white px-7 py-2`}
        >
          Proceed to Payment
        </button>
      </form>
    </div>
  );
};

export default Shipping;
