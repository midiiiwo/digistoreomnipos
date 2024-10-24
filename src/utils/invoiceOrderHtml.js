import moment from 'moment';

export const invoiceOrderHtml = (items, data, receiptItem, isEstimate) => {
  const {
    cart,
    customer,
    merchantDetails,
    invoiceNumber,
    invoiceDate,
    dueDate,
    notes,
    user,
    grandTotal,
    taxes,
    subTotal,
  } = items;
  const imgUrl =
    (merchantDetails &&
      merchantDetails.merchant_brand_logo.length > 0 &&
      'https://payments.ipaygh.com/app/webroot/img/logo/' +
        merchantDetails.merchant_brand_logo) ||
    user.user_merchant_logo;

  let rows = '';

  cart
    .filter(i => i)
    .forEach(product => {
      const itemDesc = `<td style="flex: 3; text-align: start; padding-left: 0.8rem;font-family: sans-serif"><span style="color: #30475e">${
        product.itemName
      } ${
        product &&
        product.order_item_props &&
        typeof product.order_item_props === 'string' &&
        product.order_item_props.length > 0
          ? `<span style="font-size: 0.8rem;font-family: sans-serif">(${product.order_item_props
              .split(',')
              .map(i => {
                if (i) {
                  return i.split(':')[1];
                }
              })

              .toString()
              .replaceAll(',', ', ')})</span>`
          : ''
      }</span></td>`;
      const price = `<td style="flex: 1; text-align: start; padding-left:1.4rem;font-family: sans-serif"><span style="color: #30475e">${new Intl.NumberFormat(
        'en-US',
        { maximumFractionDigits: 2, minimumFractionDigits: 2 },
      ).format(Number(product.amount))}</span></td>`;
      const qty = `<td style="flex: 1; text-align: start; padding-left: 0.8rem;font-family: sans-serif"><span style="color: #30475e">${product.quantity}</span></td>`;
      const amount = `<td style="flex: 1; text-align: start; padding-left: 0.8rem;font-family: sans-serif"><span style="color: #30475e">${new Intl.NumberFormat(
        'en-US',
        { maximumFractionDigits: 2, minimumFractionDigits: 2 },
      ).format(Number(product.amount) * Number(product.quantity))}</span></td>`;
      const row =
        '<tr style="display: flex; flex-direction: row; border-bottom: 0.1px solid #ddd; padding-top: 0.5rem; padding-bottom: 0.5rem">' +
        itemDesc +
        price +
        qty +
        amount +
        '</tr>';
      rows += row;
    });

  let inclusiveTaxRow = '';
  (taxes || []).forEach(tax => {
    if (tax?.tax_type === 'INCLUSIVE') {
      const head = `<th style="text-align: end; font-weight: 400; font-family: sans-serif"><span>${
        tax.tax_name
      } ${tax.tax_type === 'INCLUSIVE' ? 'Incl' : 'Excl'}</span></th>`;
      const value = `<td style="font-weight: 400; font-family: sans-serif"><span data-prefix>GHS </span><span>${new Intl.NumberFormat(
        'en-US',
        { maximumFractionDigits: 2, minimumFractionDigits: 2 },
      ).format(Number(tax.tax_charged))}</span></td>`;
      const row = `<tr>${head + value}</tr>`;
      inclusiveTaxRow += row;
    }
  });

  let exclusiveTaxRow = '';
  (taxes || []).forEach(tax => {
    if (tax?.tax_type === 'EXCLUSIVE') {
      const head = `<th style="text-align: end; font-weight: 400; font-family: sans-serif"><span>${
        tax.tax_name
      } ${tax.tax_type === 'INCLUSIVE' ? 'Incl' : 'Excl'}</span></th>`;
      const value = `<td style="font-weight: 400; font-family: sans-serif"><span data-prefix>GHS </span><span>${new Intl.NumberFormat(
        'en-US',
        { maximumFractionDigits: 2, minimumFractionDigits: 2 },
      ).format(Number(tax.tax_charged))}</span></td>`;
      const row = `<tr>${head + value}</tr>`;
      exclusiveTaxRow += row;
    }
  });

  const htmlContent = `
        <html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Replit</title>
     
  </head>
  <style>
    @media print { * { -webkit-print-color-adjust: exact !important; } }
    .address-text {
      font: 0.9rem sans-serif;
      color: #30475e;
      margin: 8px;
      margin-left: 0;
    }
    .merchant-name {
      font: bold 0.8rem Verdana;
      letter-spacing: 0.5em;
      text-transform: uppercase;
      color: #30475e;
      text-transform: uppercase;
    }
    .image-wrapper {
      margin-left: auto;
    }
    .bill-to {
      font: 0.8rem Verdana;
      color: #30475e;
      font-weight: 800;
      margin: 5px 0px 5px;
    }
    .head-text {
      color: #fff;
      flex: 1;
      text-align: start;
      padding-left: 0.6rem;
      font-family: Verdana;
    }
    table.meta,
    table.balance {
      float: right;
      width: 36%;
      margin-top: 0rem;
    }
    table.meta:after,
    table.balance:after {
      clear: both;
      content: '';
      display: table;
    }

    /* table meta */

    table.meta th {
      width: 40%;
    }
    table.meta td {
      width: 60%;
    }

    /* table items */

    table.inventory {
      clear: both;
      width: 100%;
      margin-top: 1rem;
    }
    table.inventory th {
      font-weight: bold;
      text-align: center;
    }

    table.inventory td:nth-child(1) {
      width: 26%;
    }
    table.inventory td:nth-child(2) {
      width: 38%;
    }
    table.inventory td:nth-child(3) {
      text-align: right;
      width: 12%;
    }
    table.inventory td:nth-child(4) {
      text-align: right;
      width: 12%;
    }
    table.inventory td:nth-child(5) {
      text-align: right;
      width: 12%;
    }
    aside h1 { border: none; border-width: 0 0 1px; margin: 0 0 1em; }
    aside h1 { border-color: #999; border-bottom-style: solid; }

    /* table balance */

    table.balance th, table.balance td { width: 50%; }
    table.balance td { text-align: right; }
    table.meta, table.balance { float: right; width: 36%; margin-top: 0.5rem }
    table.meta:after, table.balance:after { clear: both; content: ""; display: table; }

    .corner-ribbon{
    width: 200px;
    background: #e43;
    position: absolute;
    top: 25px;
    left: -50px;
    text-align: center;
    line-height: 50px;
    letter-spacing: 1px;
    color: #f0f0f0;
    transform: rotate(-45deg);
    -webkit-transform: rotate(-45deg);
  }

.corner-ribbon.sticky{
  position: absolute;
}

.corner-ribbon.shadow{
  box-shadow: 0 0 3px rgba(0,0,0,.3);
}

.corner-ribbon.top-right{
  top: 25px;
  right: -50px;
  left: auto;
  transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
}
.anchor-button {
    display: block;
    width: 100%;
    height: 25px;
    background: #32CB63;
    padding: 10px;
    text-align: center;
    border-radius: 5px;
    color: white;
    font-weight: bold;
    line-height: 25px;
    margin-top: 15px;
    margin-left: auto;

}
#qrcode {
  width:160px;
  height:160px;
  margin-top:15px;
}

  </style>
  <body>
    <header>
     ${
       data?.order_status !== 'PAID' && data?.order_status !== 'COMPLETED'
         ? '<div style="background: rgba(176, 71, 89, 0.15)" class="corner-ribbon top-right sticky blue"><h3 style="color: rgba(176, 71, 89, 1); font-weight: bold; font-size: 1.2rem; margin: 0;font-family: sans-serif">UNPAID</h3></div>'
         : '<div style="background: rgba(26, 172, 172, 0.15)" class="corner-ribbon top-right sticky blue"><h3 style="color: rgba(26, 172, 172, 1); font-weight: bold; font-size: 1.2rem; margin: 0;font-family: sans-serif">PAID</h3></div>'
     }
    </header>
    <main style="padding-left: 0.8rem; padding-right: 0.8rem"> 
      <h1
        style="
          font: bold 100% Verdana;
          letter-spacing: 0.8em;
          text-transform: uppercase;
          color: #30475e;
          text-align: center;
          margin-top: 2rem
        "
      >
        ${isEstimate ? 'ESTIMATE' : 'INVOICE'}
      </h1>
      <div style="display: flex; flex-direction: row; align-items: center">
        <div>
          <h3 class="merchant-name">${
            merchantDetails && merchantDetails.merchant_name
          }</h3>
          ${
            receiptItem?.receipt_show_tin === 'YES'
              ? `<p class="address-text">Tin: ${
                  merchantDetails && merchantDetails.merchant_reg_number
                }</p>`
              : ''
          }
         ${
           receiptItem?.receipt_show_address === 'YES'
             ? `<p class="address-text">
            ${merchantDetails && merchantDetails.merchant_address}
          </p>`
             : ''
         }
          ${
            receiptItem?.receipt_show_phone === 'YES'
              ? `<p class="address-text">Tel: ${
                  merchantDetails && merchantDetails.merchant_phone
                }</p>`
              : ''
          }
          ${
            receiptItem?.receipt_show_email === 'YES'
              ? `<p class="address-text">Email: ${
                  merchantDetails && merchantDetails.merchant_email
                }</p>`
              : ''
          }
        </div>
        ${
          receiptItem?.receipt_show_logo === 'YES'
            ? `<div class="image-wrapper">
            <img src="${imgUrl}" alt="HTML5 Icon" width="84" height="84" style="margin-right: 2rem" />
          </div>`
            : ''
        }
      </div>
      <div
        style="
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          margin-top: 1.5rem;
        "
      >
        ${
          receiptItem?.receipt_show_customer === 'YES'
            ? `<div>
          <h3 class="bill-to">Bill To:</h3>
          <p class="address-text">${customer && customer.name}</p>
          <p class="address-text">${customer && customer.email}</p>
          <p class="address-text">${customer && customer.phone}</p>
        </div>`
            : ''
        }
        <div style="margin-left: auto">
          <h3 class="address-text" style="text-align: end; font-size: 1.0rem">
            ${
              isEstimate ? 'Estimate' : 'Invoice'
            } Number: &nbsp #${invoiceNumber}
          </h3>
          <p class="address-text" style="text-align: end; font-size: 1.0rem">
            Order No: &nbsp${(data && data.order_no) || ''}
          </p>
          <p class="address-text" style="text-align: end; font-size: 1.0rem">
            Transaction ID: &nbsp${(data && data.payment_invoice) || ''}
          </p>
          <p class="address-text" style="text-align: end; font-size: 1.0rem">
            ${isEstimate ? 'Estimate' : 'Invoice'} Date: &nbsp ${moment(
    invoiceDate,
  ).format('MMM DD, YYYY')}
          </p>
          <p class="address-text" style="text-align: end; font-size: 1.0rem">
            Due Date: &nbsp ${moment(dueDate).format('MMM DD, YYYY')}
          </p>
          
        </div>
      </div>
      </div>
      <table class="inventory">
        <thead>
          <tr
            style="
              background-color: #374151;
              display: flex;
              flex-direction: row;
            "
          >
           <tr style="background-color: #374151; display: flex; flex-direction: row;">
               <th style="color: #fff; flex: 3; text-align: start; padding-left: 0.6rem;"><h5 style="margin-top: 0.6rem; margin-bottom: 0.6rem;font-family: sans-serif">Item Description</h5></th>
                <th style="color: #fff; flex: 1; text-align: start; padding-left: 0.0rem;"><h5 style="margin-top: 0.6rem; margin-bottom: 0.6rem;font-family: sans-serif">Price</h5></th>
              <th style="color: #fff; flex: 1; text-align: start; padding-left: 0.0rem;"><h5 style="margin-top: 0.6rem; margin-bottom: 0.6rem;font-family: sans-serif">Qty</h5></th>
                <th style="color: #fff; flex: 1; text-align: start; padding-left: 0.0rem;"><h5 style="margin-top: 0.6rem; margin-bottom: 0.6rem;font-family: sans-serif">Amount</h5></th>
          </tr>
        </thead>
        <tbody>
            ${rows}
        </tbody>
      </table>
      <div style="display: flex; flex-direction: column">
          <table class="balance" style="margin-top: 1rem; margin-left: auto;">
            <tr>
              <th style="text-align: end; font-weight: 400"><span style="color: #30475e;font-family: sans-serif">Subtotal</span></th>
              <td font-weight: 400><span data-prefix style="color: #30475e;font-family: sans-serif">GHS </span><span style="color: #30475e">${new Intl.NumberFormat(
                'en-US',
                { maximumFractionDigits: 2, minimumFractionDigits: 2 },
              ).format(Number(data?.order_amount || subTotal))}</span></td>
            </tr>
            ${
              data?.order_discount && Number(data?.order_discount) !== 0
                ? `<tr>
              <th style="text-align: end; font-weight: 400;font-family: sans-serif"><span style="color: #30475e;font-family: sans-serif">Discount</span></th>
              <td><span data-prefix style="color: #30475e;font-family: sans-serif">GHS </span><span style="color: #30475e;font-family: sans-serif">${new Intl.NumberFormat(
                'en-US',
                { maximumFractionDigits: 2, minimumFractionDigits: 2 },
              ).format(Number(data?.order_discount))}</span></td>
            </tr>`
                : ''
            }
              ${exclusiveTaxRow}
            ${
              items && items.delivery && Number(items.delivery) > 0
                ? `<tr style="text-align: end">
              <th><span style="color: #30475e; font-weight: 400;font-family: sans-serif">Delivery</span></th>
              <td><span data-prefix style="color: #30475e;font-family: sans-serif">GHS </span><span style="color: #30475e;font-family: sans-serif">${new Intl.NumberFormat(
                'en-US',
                { maximumFractionDigits: 2, minimumFractionDigits: 2 },
              ).format(Number(items.delivery))}</span></td>
            </tr>`
                : ''
            }
            
             ${
               items && items.fee_charge && Number(items.fee_charge) > 0
                 ? `<tr>
              <th style="text-align: end; font-weight: 400;font-family: sans-serif"><span style="color: #30475e;font-family: sans-serif">Processing Fee</span></th>
              <td><span style="color: #30475e;font-family: sans-serif" data-prefix>GHS </span><span style="color: #30475e;font-family: sans-serif">${items.fee_charge}</span></td>
            </tr>`
                 : ''
             } 
            
            <tr>
              <th style="text-align: end;"><span style="color: #30475e; font-weight: normal;font-family: sans-serif">Total</span></th>
              <td ><span data-prefix style="color: #30475e;font-family: sans-serif">GHS </span><span style="color: #30475e;font-family: sans-serif">${new Intl.NumberFormat(
                'en-US',
                { maximumFractionDigits: 2, minimumFractionDigits: 2 },
              ).format(grandTotal)}</span></td>
            </tr>  
            <tr>
              <th style="font-weight: bold; text-align: end"><span style="color: #4B56D2;font-family: sans-serif">Amount Due</span></th>
              <td style="font-weight: bold;font-family: sans-serif"><span data-prefix style="color: #4B56D2;font-family: sans-serif">GHS </span><span style="color: #4B56D2;font-family: sans-serif">${new Intl.NumberFormat(
                'en-US',
                { maximumFractionDigits: 2, minimumFractionDigits: 2 },
              ).format(grandTotal)}</span></td>
            </tr>  
            ${inclusiveTaxRow} 
      </table>
       
      <aside style="margin-top: 1rem">
        <h1 class="merchant-name"><span>Notes/Terms</span></h1>
        <div>
          <p style="color: #30475e;font-family: sans-serif">${notes || ''}</p>
        </div>
      </aside>
      </div>
      ${
        data?.order_status !== 'PAID' &&
        data?.order_status !== 'COMPLETED' &&
        !isEstimate
          ? `<div style="display: flex; align-items: center; justify-content: center; margin-top: 1rem; flex-direction: column">
        <img src="${` https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${
          data?.invoice_url || ''
        }`}" alt="HTML5 Icon" width="100" height="100" style="align-self: auto" />
        <p style="color: #192655; font-family: sans-serif; margin: 0; margin-top: 15;" >SCAN TO PAY</p>
        <h1 style="color: #192655; font-family: sans-serif; margin: 0; margin-top: 2; font-size: 16">OR</h1>
        <div style="width: 32%; margin-right: 29.9px">
                <a style="text-decoration: none; font-family: sans-serif" class="anchor-button" href="${
                  data?.invoice_url || ''
                }">CLICK TO PAY</a>
      </div>
       ${
         !isEstimate
           ? '<img style="height: 6rem;  " src="https://payments.ipaygh.com/app/webroot/img/logo/DSPayments.png" />'
           : ''
       }
      </div>`
          : ''
      }
    </main>
     <footer style="margin-top: auto;  position: absolute; bottom: 12px; width: 100%; border-top: 1px solid #aaa" >
        <p style="font-size: 1.1rem; font-family: Sans-serif; text-align: center;
         margin-left: 2rem; "> ${
           isEstimate ? 'Estimate ' : 'Invoice '
         }created using Digistore Business Manager <img style="height: 22; margin-left: 12px" src="https://payments.ipaygh.com/app/webroot/img/logo/DSBMLogo.jpg" />
          </p>
          <p style="padding-top: 0; margin-top: 0; font-size: 1.1rem; font-family: Sans-serif; text-align: center; margin-left: 2rem">Download the App or Visit <a style="color: blue" href="https://digistoreafrica.com">www.digistoreafrica.com</a> to sign up and create professional invoices</p>
    </footer>
  </body>
</html>
      `;
  return htmlContent;
};
