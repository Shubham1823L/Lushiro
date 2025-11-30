import { fill } from "@cloudinary/url-gen/actions/resize";
import cld from "../libs/cloudinary";
import { format, quality } from "@cloudinary/url-gen/actions/delivery";
import { auto as fAuto } from "@cloudinary/url-gen/qualifiers/format";
import { auto as qAuto } from "@cloudinary/url-gen/qualifiers/quality";


const genImage = (publicId, width) => {
    return cld.image(publicId).resize(fill().width(width)).delivery(format(fAuto())).delivery(quality(qAuto()))
}

export default genImage