const axios = require('axios');

// Dados de exemplo baseados na documentação do Perfect Pay
const webhookData = {
  "token": "7378fa24f96b38a3b1805d7a6887bc82",
  "code": "PPCPMTB58MNF4E",
  "sale_amount": 47.90,
  "currency_enum": 1,
  "coupon_code": null,
  "installments": 1,
  "installment_amount": null,
  "shipping_type_enum": 1,
  "shipping_amount": null,
  "payment_method_enum": 1,
  "payment_type_enum": 1,
  "billet_url": "",
  "billet_number": null,
  "billet_expiration": null,
  "quantity": 1,
  "sale_status_enum": 2, // 2 = approved
  "sale_status_detail": "approved",
  "date_created": "2024-12-07 18:24:02",
  "date_approved": "2024-12-07 18:25:02",
  "product": {
    "code": "LOVELY_PRODUCT",
    "name": "Lovely App",
    "external_reference": "LOVELY001",
    "guarantee": 7
  },
  "plan": {
    "code": "PPU38CPQ6NQ", // Plano Básico
    "name": "Plano Básico",
    "quantity": 1
  },
  "plan_itens": [],
  "customer": {
    "customer_type_enum": 1,
    "full_name": "João Silva",
    "email": "joao.teste@exemplo.com",
    "identification_type": "CPF",
    "identification_number": "12345678901",
    "birthday": "1990-01-01",
    "phone_area_code": "11",
    "phone_number": "999999999",
    "street_name": "Rua Teste",
    "street_number": "123",
    "district": "Centro",
    "complement": "",
    "zip_code": "01234-567",
    "city": "São Paulo",
    "state": "SP",
    "country": "BR"
  },
  "metadata": {
    "src": null,
    "utm_source": null,
    "utm_medium": null,
    "utm_campaign": null,
    "utm_term": null,
    "utm_content": null,
    "utm_perfect": null
  },
  "webhook_owner": "LOVELY_OWNER",
  "commission": [],
  "marketplaces": {}
};

async function testWebhook() {
  try {
    console.log('🧪 Testando webhook do Perfect Pay...');
    console.log('📧 Email do cliente:', webhookData.customer.email);
    console.log('💰 Valor:', `R$ ${webhookData.sale_amount}`);
    console.log('📦 Plano:', webhookData.plan.name);
    
    const response = await axios.post('http://127.0.0.1:3333/api/webhook/perfect-pay', webhookData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Webhook processado com sucesso!');
    console.log('📊 Resposta:', response.data);

  } catch (error) {
    console.error('❌ Erro ao testar webhook:', error.response?.data || error.message);
  }
}

// Executar teste
testWebhook(); 