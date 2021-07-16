import { SiteClient } from 'datocms-client';

export default async function recebedorDeRequest(request, response) {
    
    if(request.method === 'POST') {
        const TOKEN = '09ebe43f6240d7d9671e687787d723';

        const client = new SiteClient(TOKEN);

        const record = await client.items.create({
            itemType: '968628',
            ...request.body,
            //title
            //image
            //creatorSlug
        });

        response.json({
            record: record
        });
        return;
    }

    response.status(404).json({
        message: 'não temos menssagem no GET, mas no post tem!!'
    });
    
    
}