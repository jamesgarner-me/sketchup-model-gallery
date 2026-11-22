import { catalog } from '../catalog'
import { siteName } from '../config'
import { renderGallery } from './render'
import '../base.css'
import './gallery.css'

document.title = siteName
document.getElementById('site-name')!.textContent = siteName
document.getElementById('gallery')!.innerHTML = renderGallery(catalog)
