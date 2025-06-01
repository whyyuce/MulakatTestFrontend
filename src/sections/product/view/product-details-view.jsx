import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

import { paths } from 'src/routes/paths';

import { _mock, _orders, ORDER_STATUS_OPTIONS } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';

import eventEmitter from './event-emitter';
import ProductDetailsInfo from '../product-details-inf';
import ProductDetailsHistory from '../product-detail-history';
import ProductDetailsToolbarUpload from '../product-details-toolbar_upload';

// -----
export default function ProductDetailsView({ id }) {
  const state = useLocation();
  const [status, setStatus] = useState(false);
  const settings = useSettingsContext();
  const RemarkData = state.state.rowData;
  const [remarkData, setRemarkData] = useState(RemarkData);
  console.log('logdata', remarkData);
  const [comments, setComments] = useState([]);
  const updateRemarkData = (newData) => {
    setRemarkData(newData);
  };
  const updateCommData = (newData) => {
    console.log('setcomm', newData);
    setComments(newData);
  };

  const updateStatus = (newStatus) => {
    handleClick();
    setStatus(newStatus);
    // handleClick() fonksiyonunu burada çağırın (aşağıda daha detaylı)
  };
  const updateSecondCommData = (newData) => {
    console.log('setcomm', newData);
    setComments(newData);
    eventEmitter.off('statusUpdated');
  };
  useEffect(() => {
    const fetchComments = async (remarkId) => {
      console.log('rem', remarkId);
      try {
        const response = await fetch(
          `http://localhost:3000/api/comments/remarks/${remarkId}/comments`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch comments');
        }
        const data = await response.json();
        console.log('mesajalr', data);
        setComments(data.comments);
      } catch (error) {
        console.error('Error fetching comments:', error);
        setComments([]); // Hata durumunda boş bir dizi ayarlayın
      }
    };

    fetchComments(remarkData._id); // Yorumları almak için fetchComments işlevini çağırın
  }, [remarkData._id]); // _id değiştiğinde bu etkileşim çalışacak

  const history = {
    orderTime: _mock.time(1),
    paymentTime: _mock.time(2),
    deliveryTime: _mock.time(3),
    completionTime: _mock.time(4),
    timeline: [
      { title: 'Published', time: _mock.time(1) },
      { title: 'Approved', time: _mock.time(2) },
      { title: 'In Progress', time: _mock.time(3) },
      {
        title: 'Cancelled',
        time: _mock.time(4),
      },
      { title: 'Done', time: _mock.time(5) },
    ],
  };
  const fetchComments = async (remarkId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/remarks/${remarkId}/comments`);
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      const data = await response.json();
      return data.comments; // Burada dönen yorumları kullanabilirsiniz
    } catch (error) {
      console.error('Error fetching comments:', error);
      // Hata durumunda gerekli işlemleri yapabilirsiniz
      return []; // Boş bir dizi döndürülebilir veya hata durumuna göre bir işlem yapılabilir
    }
  };
  // const currentOrder = _orders.filter((order) => order.id === id)[0];

  //  const [status, setStatus] = useState(currentOrder.status);

  // const handleChangeStatus = useCallback((newValue) => {
  //   setStatus(newValue);
  // }, []);
  if (!RemarkData) {
    return <div>Loading...</div>;
  }
  console.log('remarkdata', RemarkData);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <ProductDetailsToolbarUpload
        backLink={paths.dashboard.product.root}
        orderNumber={RemarkData.Remark_Number}
        //   createdAt={currentOrder.createdAt}
        status={RemarkData.statu}
        //  onChangeStatus={handleChangeStatus}
        statusOptions={ORDER_STATUS_OPTIONS}
      />

      <Grid container spacing={3}>
        <Grid xs={12} md={6}>
          {/* <OrderDetailsItems
              items={currentOrder.items}
              taxes={currentOrder.taxes}
              shipping={currentOrder.shipping}
              discount={currentOrder.discount}
              subTotal={currentOrder.subTotal}
              totalAmount={currentOrder.totalAmount}
            /> */}

          <ProductDetailsHistory
            data={RemarkData}
            comms={comments}
            updateRemarkData={updateRemarkData}
            updateCommData={updateCommData}
            updateSecondCommData={updateSecondCommData}
            //   reviews={product.reviews}
            history={history}
            order1={_orders}
          />
        </Grid>

        <Grid xs={12} md={6}>
          <ProductDetailsInfo
            data={remarkData}
            updateStatus={updateStatus}
            updateRemarkData={updateRemarkData}
            updateCommData={updateCommData}
            updateSecondCommData={updateSecondCommData}
            //     customer={currentOrder.customer}
            //   delivery={currentOrder.delivery}
            //  payment={currentOrder.payment}
            // shippingAddress={currentOrder.shippingAddress}
          />
        </Grid>
      </Grid>
    </Container>
  );
}

ProductDetailsView.propTypes = {
  id: PropTypes.string,
};
