import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { QUERY_CHECKOUT } from '../utils/queries';

function Checkout() {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [checkout, { data }] = useMutation(QUERY_CHECKOUT);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);
    const result = await stripe.createToken(card);

    if (result.error) {
      setError(result.error.message);
    } else {
      const { data } = await checkout({
        variables: { products: },
      });

      if (data.checkout.session) {
        window.location.href = data.checkout.session;
      }
    }
  };

  return (
    <div>
      <h1>Checkout</h1>
      <form onSubmit={handleSubmit}>
        <CardElement />
        <button type="submit" disabled={!stripe}>
          Pay
        </button>
      </form>
      {error && <div>{error}</div>}
    </div>
  );
}

export default Checkout;
