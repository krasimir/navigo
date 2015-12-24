export default function clean(s) {
  return s.replace(/\/$/, '').replace(/^\//, '');
}