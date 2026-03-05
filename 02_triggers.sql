-- 1. TRIGGER BEFORE INSERT: No permitir precio negativo ni stock < 0
CREATE OR REPLACE FUNCTION fn_validar_positivos()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.precio < 0 THEN
        RAISE EXCEPTION 'Error: El precio % debe ser positivo', New.precio;
    END IF;

    IF NEW.stock < 0 THEN
        RAISE EXCEPTION 'Error: El stock % debe ser positivo', New.stock;
    END IF;

RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validar_positivos
BEFORE INSERT OR UPDATE ON productos
FOR EACH ROW EXECUTE FUNCTION fn_validar_positivos();


-- 2. TRIGGER AFTER UPDATE Registrar cambios de precio en audit_log
CREATE OR REPLACE FUNCTION fn_auditar_precio()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.precio IS DISTINCT FROM NEW.precio THEN
        INSERT INTO audit_log (tabla, accion, registro_id, detalle)
        VALUES ('productos', 'Actualización', NEW.id, 'Precio cambió de: ' || OLD.precio || ' a: ' || NEW.precio);
    END IF;

RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_auditar_precio
AFTER UPDATE ON productos
FOR EACH ROW EXECUTE FUNCTION fn_auditar_precio();


-- 3. TRIGGER BEFORE UPDATE: Auto-actualizar update_at 
CREATE OR REPLACE FUNCTION fn_actualizar_fecha()
RETURNS TRIGGER AS $$
BEGIN
    NEW.update_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_actualizar_fecha
BEFORE UPDATE ON productos
FOR EACH ROW EXECUTE FUNCTION fn_actualizar_fecha();


-- 4. TRIGGER BEFORE DELETE: Soft-delete (RETURN NULL + marcar is_deleted)
CREATE OR REPLACE FUNCTION fn_soft_delete()
RETURNS TRIGGER AS $$
BEGIN 
    UPDATE productos SET is_deleted = true, update_at = NOW()
    WHERE id = OLD.id;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_soft_delete
BEFORE DELETE ON productos
FOR EACH ROW EXECUTE FUNCTION fn_soft_delete();


