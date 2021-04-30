import React from 'react';
import PropTypes from 'prop-types';

const CommentFileThumbnail = ({
  removePreloadedFile,
  type,
  label
}) => {

  const Icon = React.useMemo(() => {
    let iconClass;
    switch (type.toLowerCase()) {
      case 'pdf':
        iconClass = 'fa-file-pdf';
        break;
      case 'xls':
      case 'xlt':
      case 'xlsm':
      case 'xlsb':
      case 'xltx':
      case 'xltm':
      case 'xml':
      case 'xlam':
      case 'xla':
      case 'xlw':
      case 'xlr':
        iconClass = 'fa-file-excel';
        break;
      case 'csv':
        iconClass = 'fa-file-csv';
        break;
      case 'dif':
      case 'fods':
      case 'numbers':
      case 'numbers-tef':
      case 'ods':
      case 'ots':
      case 'sxc':
      case 'tsv':
        iconClass = 'fa-file-speadsheet';
        break;
      case 'doc':
      case 'docx':
      case 'docm ':
      case 'dot':
      case 'dotx':
      case 'dotm':
      case 'docb':
        iconClass = 'fa-file-word';
        break;
      case 'aba':
      case 'md':
      case 'odt':
      case 'ott':
      case 'rtf':
      case 'txt':
      case 'wps':
        iconClass = 'fa-file-alt';
        break;
      case 'odp':
      case 'otp':
      case 'pot':
      case 'potm':
      case 'potx':
      case 'pps':
      case 'ppsm':
      case 'ppsx':
      case 'ppt':
      case 'pptm':
      case 'pptx':
        iconClass = 'fa-file-powerpoint';
        break;
      case '3g2':
      case '3gp':
      case 'asf':
      case 'avi':
      case 'f4v':
      case 'flv':
      case 'h264':
      case 'h265':
      case 'm4v':
      case 'mjpeg':
      case 'mk3d':
      case 'mks':
      case 'mkv':
      case 'mov':
      case 'mp4':
      case 'mxf':
      case 'qt':
      case 'rm':
      case 'rmvb':
      case 'rv':
      case 'srt':
      case 'vob':
      case 'vp6':
      case 'vp8':
      case 'vp9':
      case 'webm':
      case 'wmv':
      case 'xvid':
        iconClass = 'fa-file-video';
        break;
      case 'aac':
      case 'ac3':
      case 'alac':
      case 'flac':
      case 'm3u':
      case 'mid':
      case 'mka':
      case 'mp3':
      case 'mpc':
      case 'ogg':
      case 'opus':
      case 'ra':
      case 'sdt':
      case 'stap':
      case 'wav':
      case 'wma':
        iconClass = 'fa-file-audio';
        break;
      case 'adb':
      case 'ads':
      case 'ahk':
      case 'applescript':
      case 'as':
      case 'au3':
      case 'bat':
      case 'bas':
      case 'btm':
      case 'class':
      case 'cljs':
      case 'cmd':
      case 'coffee':
      case 'c':
      case 'cpp':
      case 'cs':
      case 'css':
      case 'ino':
      case 'egt':
      case 'erb':
      case 'go':
      case 'hta':
      case 'html':
      case 'ibi':
      case 'ici':
      case 'ijs':
      case 'itcl':
      case 'jar':
      case 'java':
      case 'js':
      case 'jsx':
      case 'jsp':
      case 'less':
      case 'lua':
      case 'm':
      case 'mrc':
      case 'nuc':
      case 'nud':
      case 'o':
      case 'pde':
      case 'php':
      case 'pl':
      case 'pm':
      case 'ps1':
      case 'ps1xml':
      case 'psc1':
      case 'psd1':
      case 'py':
      case 'pyc':
      case 'pyo':
      case 'rb':
      case 'rdp':
      case 'red':
      case 'rs':
      case 'sb2/sb3':
      case 'scpt':
      case 'scptd':
      case 'sdl':
      case 'sh':
      case 'syjs':
      case 'sypy':
      case 'dcl':
      case 'tns':
      case 'vbs':
        iconClass = 'fa-file-code';
        break;
      case '7z':
      case 'arc':
      case 'arj':
      case 'b6z':
      case 'bz2':
      case 'daa':
      case 'dar':
      case 'deb':
      case 'gz':
      case 'ice':
      case 'mpkg':
      case 'rar':
      case 'tar':
      case 'tbz':
      case 'tgs':
      case 'xapk':
      case 'zim':
      case 'zip':
        iconClass = 'fa-file-archive';
        break;
      default:
        iconClass = 'fa-file';
        break;
    }

    return (
      <i className={`fal fa-3x ${iconClass} text-primary`} aria-hidden="true" />
    );
  }, [type]);

  return (
    <>
      <div className="float-left attachment mx-2 rounded border file d-flex">
        <i className="remove border bg-dark text-white rounded-circle far fa-times" aria-hidden="true" onClick={removePreloadedFile}></i>
        <span className="align-self-center">
          {Icon}
        </span>
        <span className="ellipsis align-self-center font-weight-bold p-2">{label}</span>
      </div>
    </>
  );
};

CommentFileThumbnail.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  removePreloadedFile: PropTypes.func,
};
CommentFileThumbnail.defaultProps = {
  label: 'unknown',
};
CommentFileThumbnail.displayName = 'CommentFileThumbnail';

export default CommentFileThumbnail;
