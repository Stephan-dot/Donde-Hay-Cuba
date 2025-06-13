import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { databases, storage, account } from "../firebase-config";
import './AddReportes.css';
import { Query, ID } from 'appwrite';
import { CustomToaster, showToast } from './CustomToast';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const CUBA_LIMITS = {
  latMin: 19.9,
  latMax: 23.2,
  lngMin: -85,
  lngMax: -74.1
};

const validationSchema = Yup.object().shape({
  producto: Yup.string()
    .required('El producto es requerido')
    .max(100, 'El nombre es demasiado largo'),
    
  tipo: Yup.string()
    .required('El tipo es requerido')
    .oneOf(['medicamento', 'alimento'], 'Tipo inválido'),

  precio: Yup.number()
    .required('El precio es requerido')
    .positive('El precio debe ser positivo')
    .typeError('Debe ser un número válido'),

  comercioId: Yup.string()
    .required('Debe seleccionar un comercio'),

  ubicacion: Yup.array()
    .of(Yup.number().required())
    .length(2, 'Debe proporcionar latitud y longitud')
    .test(
      'is-within-cuba',
      'Las coordenadas deben estar dentro de Cuba',
      function(value) {
        if (!value || value.length !== 2) return false;
        const [lat, lng] = value;
        return (
          lat >= CUBA_LIMITS.latMin &&
          lat <= CUBA_LIMITS.latMax &&
          lng >= CUBA_LIMITS.lngMin &&
          lng <= CUBA_LIMITS.lngMax
        );
      }
    ),

  foto: Yup.mixed()
    .test(
      'fileSize',
      'La imagen debe ser menor a 2MB',
      (value) => !value || (value && value.size <= 2 * 1024 * 1024)
    )
    .test(
      'fileType',
      'Solo se permiten imágenes',
      (value) => !value || (value && value.type.match('image.*')))
});

function AddReport() {
  const navigate = useNavigate();
  const [comercios, setComercios] = useState([]);
  const [fotoPreview, setFotoPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

 
  const formik = useFormik({
    initialValues: {
      producto: '',
      tipo: 'medicamento',
      precio: '',
      ubicacion: ['', ''],
      comercioId: '',
      foto: null
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsUploading(true);
      try {
        let fotoUrl = null;
        
        if (values.foto) {
          const fileId = ID.unique();
          const response = await storage.createFile(
            '6836a7d200386f17c01b',
            fileId,
            values.foto
          );
          
          fotoUrl = `https://cloud.appwrite.io/v1/storage/buckets/6836a7d200386f17c01b/files/${fileId}/view?project=6836a79400199dcfe521&mode=admin`;
        }

        await databases.createDocument(
          '6836a856002abc2c585d',
          '6836a8d000394e3080c3',
          ID.unique(),
          {
            producto: values.producto,
            tipo: values.tipo,
            precio: Number(values.precio),
            ubicacion: [parseFloat(values.ubicacion[0]), parseFloat(values.ubicacion[1])],
            fecha: new Date().toISOString(),
            userId: (await account.get()).$id,
            comercioId: values.comercioId,
            esComercioVerificado: true,
            esDisponible: true, 
            fotoUrl: fotoUrl
          }
        );

        showToast('Reporte agregado con éxito', 'success');
        setTimeout(() => {
          navigate("/list-report");
        }, 2000);
      } catch (error) {
        console.error("Error al agregar el reporte", error);
        showToast('Error al agregar el reporte', 'error');
      } finally {
        setIsUploading(false);
      }
    }
  });

  useEffect(() => {
    const fetchComercios = async () => {
      try {
        const currentUser = await account.get();
        if (!currentUser) {
          console.error("No hay un usuario logueado");
          showToast('Debes Iniciar Sesión', 'error');
          return;
        }

        const response = await databases.listDocuments(
          '6836a856002abc2c585d', 
          '6836a924002f72431f73', 
          [Query.equal('userId', currentUser.$id)]
        );
        
        setComercios(response.documents);
      } catch (error) {
        console.error("Error al obtener los comercios:", error);
        showToast('No se han encontrado comercios', 'error');
        setComercios([]);
      }
    };

    fetchComercios();
  }, []);

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      showToast('Su dispositivo no soporta geolocalización', 'error');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        formik.setFieldValue('ubicacion', [
          position.coords.latitude.toString(),
          position.coords.longitude.toString()
        ]);
      },
      (err) => {
        showToast('No se pudo obtener su ubicación: ' + err.message, 'error');
      }
    );
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      formik.setFieldValue('foto', file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="add-report-container">
      <CustomToaster/> 
      <h1 className="add-report-title">Añadir Reporte</h1>

      <form onSubmit={formik.handleSubmit} className="add-report-form">
        <div className="form-group">
          <label className="form-lable">
            Foto del producto (opcional)
            <input 
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="form-input-file" 
              style={{background: "transparent", border: 'none', boxShadow: '0px 0px 2px 0px'}}
            />
          </label>
          {formik.touched.foto && formik.errors.foto && (
            <div className="error-message">{formik.errors.foto}</div>
          )}
          {fotoPreview && (
            <div className="photo-preview">
              <img src={fotoPreview} alt="VistaPrevia" className="preview-image" style={{width:'100px',height: '100px' }} />
              <button
                type="button"
                onClick={() => {
                  setFotoPreview(null);
                  formik.setFieldValue('foto', null);
                }}
                className="remove-photo-button"
              >
                Eliminar foto
              </button>
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">
            Producto:
            <input
              type="text"
              name="producto"
              value={formik.values.producto}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="form-input"
              placeholder="Ej: Paracetamol 500mg"
            />
          </label>
          {formik.touched.producto && formik.errors.producto && (
            <div className="error-message">{formik.errors.producto}</div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">
            Tipo:
            <select
              name="tipo"
              value={formik.values.tipo}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="form-select"
            >
              <option value="medicamento">Medicamento</option>
              <option value="alimento">Alimento</option>
            </select>
          </label>
          {formik.touched.tipo && formik.errors.tipo && (
            <div className="error-message">{formik.errors.tipo}</div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">
            Precio (CUP):
            <input
              type="number"
              name="precio"
              value={formik.values.precio}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="form-input"
              placeholder="Ej: 10"
              min="0"
              step="0.01"
            />
          </label>
          {formik.touched.precio && formik.errors.precio && (
            <div className="error-message">{formik.errors.precio}</div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">
            Comercio:
            <select
              name="comercioId"
              value={formik.values.comercioId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="form-select"
            >
              <option value="">Seleccionar comercio</option>
              {comercios.length === 0 ? (
                <option value="">Cree un Comercio</option>
              ) : (
                comercios.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))
              )}
            </select>
            <Link to="/add-comerce">
              <button className="btn_commerce"> 
                Crear Comercio
              </button>
            </Link>
          </label>
          {formik.touched.comercioId && formik.errors.comercioId && (
            <div className="error-message">{formik.errors.comercioId}</div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">
            Ubicación:
            <div className="location-container">
              <input
                type="text"
                inputMode="decimal"
                name="ubicacion[0]"
                value={formik.values.ubicacion[0] || ''}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="coord-input"
                placeholder="Latitud (19.9° - 23.2°)"
              />
              <input
                type="text"
                inputMode="decimal"
                name="ubicacion[1]"
                value={formik.values.ubicacion[1] || ''}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="coord-input"
                placeholder="Longitud (-85.0° - -74.1°)"
              />
              <button 
                type="button" 
                onClick={handleGeolocation}
                className="geo-button"
              >
                Usar mi ubicación
              </button>
            </div>
            {formik.touched.ubicacion && formik.errors.ubicacion && (
              <div className="error-message">{formik.errors.ubicacion}</div>
            )}
          </label>
        </div>

        <div className="button-group">
          <button 
            type="submit" 
            className="submit-button"
            
          >
            {isUploading ? 'Subiendo...' : 'Enviar Reporte'}
          </button>
          <button 
            type="button" 
            onClick={() => navigate('/')}
            className="cancel-button"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddReport;