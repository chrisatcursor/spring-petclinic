import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/AppLayout.tsx';
import { ErrorPage } from './pages/ErrorPage.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { NotFoundPage } from './pages/NotFoundPage.tsx';
import { OwnerDetailsPage } from './pages/OwnerDetailsPage.tsx';
import { OwnerFormPage } from './pages/OwnerFormPage.tsx';
import { OwnersListPage } from './pages/OwnersListPage.tsx';
import { OwnersSearchPage } from './pages/OwnersSearchPage.tsx';
import { PetFormPage } from './pages/PetFormPage.tsx';
import { VetsPage } from './pages/VetsPage.tsx';
import { VisitFormPage } from './pages/VisitFormPage.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="oups" element={<ErrorPage status={500} />} />
          <Route path="owners/find" element={<OwnersSearchPage />} />
          <Route path="owners" element={<OwnersListPage />} />
          <Route path="owners/new" element={<OwnerFormPage />} />
          <Route path="owners/:ownerId" element={<OwnerDetailsPage />} />
          <Route path="owners/:ownerId/edit" element={<OwnerFormPage />} />
          <Route path="owners/:ownerId/pets/new" element={<PetFormPage />} />
          <Route path="owners/:ownerId/pets/:petId/edit" element={<PetFormPage />} />
          <Route path="owners/:ownerId/pets/:petId/visits/new" element={<VisitFormPage />} />
          <Route path="vets.html" element={<VetsPage />} />
          <Route path="vets" element={<Navigate to="/vets.html" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
