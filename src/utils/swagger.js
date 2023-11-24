import swaggerUi from 'swagger-ui-express'
import swaggerDocument  from '../public/docs/swagger/swagger.json'

exports.swaggerRender = (req,res) => {
    swaggerDocument.host = req.get('host');
    const options = {
        customfavIcon: '/assets/favicon.ico',
        customSiteTitle: 'Earthid SSI API Document',
    };
    swaggerUi.setup(swaggerDocument,options)(req,res);
};
